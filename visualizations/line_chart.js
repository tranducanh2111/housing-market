Promise.all([d3.json('living_area-prices.json'), d3.json('land_area-prices.json')])
    .then(([livingAreaPrice, landAreaPrice]) =>
    {
        drawLineChart(livingAreaPrice, landAreaPrice);
    }).catch((error) =>
{
    console.error(`Failed to create line chart: ${error}`);
});

/*
 * Function for creating the line chart.
 *
 * @param {json} data: Object that contains the model's price prediction for different living/land area values.
 * The values range from 50% to 150% of the inputted living/land area data.
 */
function drawLineChart(livingAreaPrice, landAreaPrice)
{
    const marginTop = 20;
    const marginRight = 50;
    const marginBottom = 30;
    const marginLeft = 65;

    const width = 900;
    const height = 500;

    // Create an SVG container
    const svg = d3.select('body')
        .append('svg')
        .attr('id', 'line-chart-svg')
        .attr('width', width)
        .attr('height', height);

    // initialize x and y axes scalers
    const x = d3.scaleLinear().range([marginLeft, width - marginRight]);
    const y = d3.scaleLinear().range([height - marginBottom, marginTop]);

    // initialize x-axis
    svg.append('g')
        .attr('class', 'line-chart-axis')
        .attr('id', 'line-chart-x-axis')
        .attr('transform', `translate(0,${height - marginBottom})`);

    // initialize y-axis
    svg.append('g')
        .attr('class', 'line-chart-axis')
        .attr('id', 'line-chart-y-axis')
        .attr('transform', `translate(${marginLeft}, 0)`);

    // tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden');

    // update the chart when the user selects a different radio button
    d3.selectAll('input[name="area"]').on('change', function() {
        update(this.value, 800);
    });

    // create graph
    update('living_area', 0);
    update('living_area', 0); // this has to be called twice for the tooltip to work ¯\_(ツ)_/¯

    // updates the chart whenever the user clicks a different radio button. Switches between land and lving area data
    function update(areaType, t)
    {
        const data = areaType === 'living_area' ? livingAreaPrice : landAreaPrice;

        const [minPrice, maxPrice, minArea, maxArea] = calculateDomainValues(data, areaType);

        // set up the new domains for the scalers
        x.domain([minArea, maxArea]);
        y.domain([minPrice, maxPrice]);
        
        // create custom tick values for always keeping the tick positions consistent
        const xTickValues = d3.range(minArea, maxArea + 1, (maxArea - minArea) / 10)
        const yTickValues = d3.range(minPrice, maxPrice + 1, (maxPrice - minPrice) / 10);

        // setup axes
        const xAxis = d3.axisBottom(x).tickSize(10).tickValues(xTickValues);
        const yAxis = d3.axisLeft(y).tickSize(10).tickValues(yTickValues);

        // update x-axis
        svg.select('#line-chart-x-axis')
            .transition()
            .duration(t)
            .call(xAxis);

        // update y-axis
        svg.select('#line-chart-y-axis')
            .transition()
            .duration(t)
            .call(yAxis);

        // remove domain lines from both axes
        svg.select('#line-chart-x-axis .domain').remove();
        svg.select('#line-chart-y-axis .domain').remove();

        // horizontal grid lines
        svg.selectAll('line.line-chart-horizontal-gridline')
            .data(yTickValues)  // Use yTickValues to match the y-axis tick values
            .enter()
            .append('line')
            .attr('class', 'line-chart-horizontal-gridline')
            .attr('x1', marginLeft)
            .attr('y1', d => y(d))  // Update y position to match tick values
            .attr('x2', width - marginRight)
            .attr('y2', d => y(d))  // Update y position to match tick values
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5);

        // vertical grid lines
        svg.selectAll('line.line-chart-vertical-gridline')
            .data(xTickValues)
            .enter()
            .append('line')
            .attr('class', 'line-chart-vertical-gridline')
            .attr('x1', d => x(d))
            .attr('y1', height - marginBottom)
            .attr('x2', d => x(d))
            .attr('y2', marginTop)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5);

        // create the line generator
        const lineGenerator = d3.line()
            .x(d => x(d[areaType]))
            .y(d => y(d['price']));

        // Update the line
        const line = svg.selectAll('.chart-line').data([data]);
        line.enter()
            .append('path')
            .attr('class','chart-line')
            .merge(line)
            .transition()
            .duration(t)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2.5)

        // Update dots
        const dots = svg.selectAll('.line-chart-dot').data(data);
        dots.enter()
            .append('circle')
            .attr('class', 'line-chart-dot')
            .attr('fill', 'steelblue')
            .attr('r', 4)
            .merge(dots)
            .transition()
            .duration(t)
            .attr('cx', d => x(d[areaType]))
            .attr('cy', d => y(d['price']));

        // Update hover dots for tooltip
        const hoverDots = svg.selectAll('.line-chart-hover-dot').data(data);
        hoverDots.enter()
            .append('circle')
            .attr('class', 'line-chart-hover-dot')
            .attr('r', 10)
            .attr('fill', 'steelblue')
            .style('opacity', 0)
            .merge(hoverDots)
            .transition()
            .duration(t)
            .attr('cx', d => x(d[areaType]))
            .attr('cy', d => y(d['price']));

        // update hover functionality
        hoverDots.on('mouseover', (event, d) =>
        {
            d3.select(event.target).style('opacity', 1);
            
            const areaStr = areaType === 'living_area' ? 'Living area' : 'Land area';
            tooltip.style('visibility', 'visible')
                .text(`${areaStr}: ${d[areaType]} m²\nPrice: ${formatPrice(d['price'])} USD`);
        });

        hoverDots.on('mousemove', (event) =>
        {
            tooltip.style('top', event.pageY - 20 + 'px')
                .style('left', event.pageX + 20 + 'px');
        });

        hoverDots.on('mouseout', (event) =>
        {
            d3.select(event.target).style('opacity', 0);
            tooltip.style('visibility', 'hidden');
        });
    }

    /*
     * Calculates the domain values based on the area type.
     * Also applies padding so that the line in the chart doesn't stick to the corners.
     */
    function calculateDomainValues(data, areaType)
    {
        let minPrice = d3.min(data, d => d['price']);
        let maxPrice = d3.max(data, d => d['price']);
        let minArea = d3.min(data, d => d[areaType]);
        let maxArea = d3.max(data, d => d[areaType]);
    
        // y-axis padding (10%)
        const pricePadding = (maxPrice - minPrice) / 10;
        minPrice -= pricePadding;
        maxPrice += pricePadding;

        // x-axis padding (10%)
        const areaPadding = (maxArea - minArea) / 10;
        minArea -= areaPadding;
        maxArea += areaPadding;

        return [minPrice, maxPrice, minArea, maxArea];
    }
}
