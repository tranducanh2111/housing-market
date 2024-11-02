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
function drawLineChart(livingAreaPrice, landAreaPrice) {
    const marginTop = 20;
    const marginRight = 50;
    const marginBottom = 30;
    const marginLeft = 65;

    const svgWidth = 900;
    const svgHeight = 500;

    // Create an SVG container
    const svg = d3.select('body')
        .append('svg')
        .attr('id', 'line-chart-svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', [0, 0, svgWidth, svgHeight])
        .attr('style', 'max-width: 100%; height: auto;');

    // get the min and max price from both datasets
    const minPrice = Math.min(d3.min(livingAreaPrice, d => d['price']), d3.min(landAreaPrice, d => d['price']));
    const maxPrice = Math.max(d3.max(livingAreaPrice, d => d['price']), d3.max(landAreaPrice, d => d['price']));
    const xAxisDomainPadding = 10;
    const yAxisDomainPadding = 10;

    // initialize x axis scaler
    const xAxisScaler = d3.scaleLinear()
        .range([marginLeft, svgWidth - marginRight]);

    // initialize x-axis
    svg.append('g')
        .attr('class', 'line-chart-axis')
        .attr('id', 'line-chart-x-axis')
        .attr('transform', `translate(0,${svgHeight - marginBottom})`);

    // create y-axis scale
    const [yLowerBound, yUpperBound] = calculateAxisDomain(minPrice, maxPrice, yAxisDomainPadding);
    const yAxisScaler = d3.scaleLinear()
        .domain([yLowerBound, yUpperBound])
        .range([svgHeight - marginBottom, marginTop]);

    // create custom tick values for always keeping the tick positions consistent
    const yTickValues = d3.range(yLowerBound, yUpperBound + 1, (yUpperBound - yLowerBound) / 10);

    // create y-axis generator
    const yAxisGenerator = d3.axisLeft(yAxisScaler)
        .tickSize(10)
        .tickValues(yTickValues);

    // create y-axis
    svg.append('g')
        .attr('class', 'line-chart-axis')
        .attr('id', 'line-chart-y-axis')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(yAxisGenerator)
        .select('.domain')
        .remove();

    // horizontal grid lines
    svg.selectAll('line.line-chart-horizontal-gridline')
        .data(yTickValues) 
        .enter()
        .append('line')
        .attr('class', 'line-chart-horizontal-gridline')
        .attr('x1', marginLeft)
        .attr('y1', d => yAxisScaler(d))  
        .attr('x2', svgWidth - marginRight)
        .attr('y2', d => yAxisScaler(d))  
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5);

    // tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden');

    // update the chart when the user selects a different radio button
    d3.selectAll('input[name="area"]').on('change', function () {
        update(this.value, 800);
    });

    // create graph
    update('living_area', 0);
    update('living_area', 0); // this has to be called twice for the tooltip to work ¯\_(ツ)_/¯

    // updates the chart whenever the user clicks a different radio button. Switches between land and lving area data
    function update(areaType, t)
    {
        const data = areaType === 'living_area' ? livingAreaPrice : landAreaPrice;

        // calculate min and max area
        const minArea = d3.min(data, d => d[areaType]);
        const maxArea = d3.max(data, d => d[areaType]);
        
        // setup x-axis domain
        const [xLowerBound, xUpperBound] = calculateAxisDomain(minArea, maxArea, xAxisDomainPadding);
        xAxisScaler.domain([xLowerBound, xUpperBound]);

        // create custom tick values for always keeping the tick positions consistent
        const xTickValues = d3.range(xLowerBound, xUpperBound + 1, (xUpperBound - xLowerBound) / 10)

        // create x-axis generator
        const xAxisGenerator = d3.axisBottom(xAxisScaler)
            .tickSize(10)
            .tickValues(xTickValues);

        // update x-axis
        svg.select('#line-chart-x-axis')
            .transition()
            .duration(t)
            .call(xAxisGenerator);
        svg.select('#line-chart-x-axis .domain')
            .remove();

        // vertical grid lines
        svg.selectAll('line.line-chart-vertical-gridline')
            .data(xTickValues)
            .enter()
            .append('line')
            .attr('class', 'line-chart-vertical-gridline')
            .attr('x1', d => xAxisScaler(d))
            .attr('y1', svgHeight - marginBottom)
            .attr('x2', d => xAxisScaler(d))
            .attr('y2', marginTop)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5);

        // create the line generator
        const lineGenerator = d3.line()
            .x(d => xAxisScaler(d[areaType]))
            .y(d => yAxisScaler(d['price']));

        // Update the line
        const line = svg.selectAll('.chart-line').data([data]);
        line.enter()
            .append('path')
            .attr('class', 'chart-line')
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
            .attr('cx', d => xAxisScaler(d[areaType]))
            .attr('cy', d => yAxisScaler(d['price']));

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
            .attr('cx', d => xAxisScaler(d[areaType]))
            .attr('cy', d => yAxisScaler(d['price']));

        // update hover functionality
        hoverDots.on('mouseover', (event, d) => {
            d3.select(event.target).style('opacity', 1);

            const areaStr = areaType === 'living_area' ? 'Living area' : 'Land area';
            tooltip.style('visibility', 'visible')
                .text(`${areaStr}: ${d[areaType]} m²\nPrice: ${formatPrice(d['price'])} USD`);
        });

        hoverDots.on('mousemove', (event) => {
            tooltip.style('top', event.pageY - 20 + 'px')
                .style('left', event.pageX + 20 + 'px');
        });

        hoverDots.on('mouseout', (event) => {
            d3.select(event.target).style('opacity', 0);
            tooltip.style('visibility', 'hidden');
        });
    }

    function calculateAxisDomain(lowerBound, upperBound, paddingPercent)
    {
        const padding = (upperBound - lowerBound) / paddingPercent;
        const lb = lowerBound - padding;
        const ub = upperBound + padding;

        return [lb, ub];
    }
}
