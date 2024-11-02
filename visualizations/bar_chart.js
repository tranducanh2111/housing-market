d3.json('cities-prices.json').then((data) =>
{
    drawBarChart(data);
}).catch((error) =>
{
    console.error(`Failed to create bar chart: ${error}`);
});

/*
 * Function for creating the bar chart.
 *
 * @param {json} data: Object that contains the model's price prediction for every city in the inputted state. 
 */
function drawBarChart(data)
{
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 60;
    const marginLeft = 65;

    const svgWidth = 900;
    const svgHeight = 500;

    // hash map containing the sorting functions for the chart's order
    const orderMap = new Map([
        ['Alphabetical', (a, b) => d3.ascending(a['city'], b['city'])],
        ['Ascending', (a, b) => d3.ascending(a['price'], b['price'])],
        ['Descending', (a, b) => d3.descending(a['price'], b['price'])]
    ]);

    // initially , have the data ordered alphabetically
    data.sort(orderMap.get('Alphabetical'));

    // create svg
    const svg = d3.select('body')
        .append('svg')
        .attr('id', 'bar-chart-svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', [0, 0, svgWidth, svgHeight])
        .attr('style', 'max-width: 100%; height: auto;');

    // x-axis scaler
    const x = getXaxisScaler();
    const rangeLeft = x.range()[1];

    // y-axis scaler
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['price'])])
        .nice()
        .range([svgHeight - marginBottom, marginTop]);

    // axes generators
    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).tickSize(0);
    
    // horizontal dashed gridlines
    svg.selectAll('line.bar-chart-horizontal-gridline')
        .data(y.ticks())
        .enter()
        .append('line')
        .attr('class', 'bar-chart-horizontal-gridline')
        .attr('x1', marginLeft)
        .attr('y1', d => y(d))
        .attr('x2', svgWidth)
        .attr('y2', d => y(d))
        .attr('stroke', '#555')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3');

    // bars
    const bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('id', d => d['city'])
        .attr('x', d => x(d['city']))
        .attr('y', d => y(d['price']))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d['price']))
        .attr('fill', 'steelblue');

    // x-axis creation
    svg.append('g')
        .attr('class', 'bar-chart-axis')
        .attr('id', 'bar-chart-x-axis')
        .attr('transform', `translate(0, ${svgHeight - marginBottom})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'translate(-5, 0) rotate(-30)');

    // y-axis creation
    svg.append('g')
        .attr('class', 'bar-chart-axis')
        .attr('id', 'bar-chart-y-axis')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(yAxis)
        .call(g => g.select('.domain').remove());

    // pan by scrolling functionality
    let transform = d3.zoomIdentity;
    const maxPan = svgWidth - rangeLeft;
    svg.on('wheel', (event) =>
    {
        event.preventDefault(); // block page scroll on event 

        // convert vertical delta to horizontal translation
        transform = transform.translate(-event.deltaY * 0.6, 0);
        transform.x = Math.max(maxPan, Math.min(0, transform.x));

        svg.select('#bar-chart-x-axis').attr('transform', `translate(${transform.x}, ${svgHeight - marginBottom})`);
        svg.selectAll('.bar').attr('transform', `translate(${transform.x}, 0)`);
    });

    // tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden');

    bars.on('mouseover', (event, d) =>
    {
        tooltip.style('visibility', 'visible')
            .text(`City: ${d['city']}\nPrice: ${formatPrice(d['price'])} USD`);
    });

    bars.on('mousemove', (event) =>
    {
        tooltip.style('top', event.pageY - 20 + 'px')
            .style('left', event.pageX + 20 + 'px');
    });

    bars.on('mouseout', (event) =>
    {
        d3.select(event.target).attr('stroke-width', 0);
        tooltip.style('visibility', 'hidden');
    });

    // handle bar sorting
    d3.select('#bar-chart-order').on('change', (event) => orderBars(event.target.value));

    /*
    * Function that creates the x-axis scaler. This ensures that the chart will contain at most 37 bars in view, in
    * order to avoid the label strings overlapping. In this case, the user will have to scroll to view the rest of
    * the bars.
    * */
    function getXaxisScaler()
    {
        const dataLength = data.length;
        const maxBars = 37;

        const maxDimensions = d3.scaleBand()
            .domain(d3.range(maxBars).map(i => `${i + 1}`))
            .range([marginLeft, svgWidth - marginRight])
            .padding(0.2);

        const maxBarWidth = maxDimensions.bandwidth();
        const maxPaddingWidth = maxDimensions.step() - maxDimensions.bandwidth();

        const axisWidth = svgWidth - marginLeft - marginRight;
        const currentWidth = dataLength * maxBarWidth + (dataLength + 1) * maxPaddingWidth;

        const calculatedWidth = Math.max(axisWidth, currentWidth);

        return d3.scaleBand()
            .domain(data.map(d => d['city']))
            .range([marginLeft, calculatedWidth + marginLeft])
            .padding(0.2);
    }

    /*
    * Function used for ordering the x-axis (cities). The order can either be alphabetical, ascending (price), and
    * descending (price).
    * */
    function orderBars(order)
    {
        // sort the data
        data.sort(orderMap.get(order));

        // create new domain for x-axis
        x.domain(data.map(d => d['city']));

        // transition for the x-axis
        svg.select('#bar-chart-x-axis')
            .transition()
            .duration(800)
            .call(xAxis);

        // transition for the bars
        svg.selectAll('.bar')
            .transition()
            .duration(800)
            .attr('x', d => x(d['city']));
    }
}
