d3.json('cities-prices.json').then((data) =>
{
    drawBarChart(data);
}).catch((error) =>
{
    console.error(`Failed to create bar chart: ${error}`);
});

function drawBarChart(data)
{
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 60;
    const marginLeft = 65;

    const width = 900;
    const height = 500;

    const orderMap = new Map([
        ['Alphabetical', (a, b) => d3.ascending(a['city'], b['city'])],
        ['Ascending', (a, b) => d3.ascending(a['price'], b['price'])],
        ['Descending', (a, b) => d3.descending(a['price'], b['price'])]
    ]);

    // order data alphabetically
    data.sort(orderMap.get('Alphabetical'));

    // create svg
    const svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

    // x-axis scaler
    const x = getXaxisScaler();
    const rangeLeft = x.range()[1];

    // y-axis scaler
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['price'])])
        .nice()
        .range([height - marginBottom, marginTop]);

    // axes
    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).tickSize(0);

    // horizontal dashed gridlines
    svg.selectAll('line.horizontal-grid')
        .data(y.ticks())
        .enter()
        .append('line')
        .attr('class', 'horizontal-grid')
        .attr('x1', marginLeft)
        .attr('y1', d => y(d))
        .attr('x2', width)
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

    // x-axis
    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - marginBottom})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'translate(-5, 0) rotate(-30)');

    // y-axis
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(yAxis)
        .call(g => g.select('.domain').remove());

    // pan with zooming
    let transform = d3.zoomIdentity;
    const maxPan = width - rangeLeft;
    svg.on('wheel', (event) =>
    {
        event.preventDefault();

        transform = transform.translate(-event.deltaY * 0.6, 0);
        transform.x = Math.max(maxPan, Math.min(0, transform.x));

        svg.select('#x-axis').attr('transform', `translate(${transform.x}, ${height - marginBottom})`);
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
    d3.select('#Order').on('change', (event) => orderBars(event.target.value));

    function getXaxisScaler()
    {
        const dataLength = data.length;
        const maxBars = 37;

        const dim = d3.scaleBand()
            .domain(d3.range(maxBars).map(i => `${i + 1}`))
            .range([marginLeft, width - marginRight])
            .padding(0.2);

        const maxBarWidth = dim.bandwidth();
        const maxPaddingWidth = dim.step() - dim.bandwidth();

        const axisWidth = width - marginLeft - marginRight;
        const currentWidth = dataLength * maxBarWidth + (dataLength + 1) * maxPaddingWidth;

        const calculatedWidth = Math.max(axisWidth, currentWidth);

        return d3.scaleBand()
            .domain(data.map(d => d['city']))
            .range([marginLeft, calculatedWidth + marginLeft])
            .padding(0.2);
    }

    function orderBars(order)
    {
        data.sort(orderMap.get(order));

        x.domain(data.map(d => d['city']));

        svg.select('#x-axis')
            .transition()
            .duration(800)
            .call(xAxis);

        svg.selectAll('.bar')
            .transition()
            .duration(800)
            .attr('x', d => x(d['city']));
    }
}