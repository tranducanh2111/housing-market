Promise.all([d3.json('us-states.json'), d3.json('state-prices.json')])
    .then(([geoJSON, statePrices]) =>
    {
        drawChoropleth(geoJSON, statePrices);
    }).catch((error) =>
{
    console.error(`Failed to create US state choropleth: ${error}`);
})

function drawChoropleth(geoJson, statePrices)
{
    const width = 1000;
    const height = 600;

    const svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const priceMap = new Map(statePrices.map(d => [d['state'], d['price']]));

    const projection = d3.geoAlbersUsa().scale([1000]).translate([width/2, height/2]);
    const path = d3.geoPath().projection(projection);

    const minHousePrice = d3.min(statePrices, d => d['price']);
    const maxHousePrice = d3.max(statePrices, d => d['price']);
    const colorScale = d3.scaleSequential([minHousePrice, maxHousePrice], d3.interpolateBlues)

    const zoom = d3.zoom()
        .scaleExtent([1, 6])
        .on('zoom', zoomed);

    svg.call(zoom);

    const g = svg.append('g');

    const states = g.selectAll('path')
        .data(geoJson['features'])
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', path)
        .attr('id', getStateName)
        .attr('fill', getStateColor);

    states.on('click', (event) => { event.stopPropagation(); });

    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'plot-tooltip')
        .style('visibility', 'hidden');

    states.on('mouseover', (event, d) =>
    {
        d3.select(event.target).raise();

        const state = getStateName(d);
        let price = getStatePrice(d);
        let tooltipText = `No data for ${state}`;

        if (price !== -1)
        {
            tooltipText = `State: ${state}\nPrice: ${formatPrice(price)} USD`;
        }

        tooltip.style('visibility', 'visible')
            .text(tooltipText);
    });

    states.on('mousemove', (event) =>
    {
        tooltip.style('top', event.pageY - 20 + 'px')
            .style('left', event.pageX + 20 + 'px');
    });

    states.on('mouseout', (event) =>
    {
        d3.select(event.target).attr('stroke-width', 0);
        tooltip.style('visibility', 'hidden');
    });

    svg.on('click', reset);

    // add color legend
    svg.append('g')
        .attr('id', 'choropleth-legend')
        .attr('transform', 'translate(610, 20)')
        .append(() => Legend(colorScale, {title: 'Price (USD)', width: 260}));

    function getStateName(d)
    {
        return d['properties']['NAME'];
    }

    function getStatePrice(d)
    {
        return priceMap.get(getStateName(d)) || -1;
    }

    function getStateColor(d)
    {
        return colorScale(getStatePrice(d));
    }

    function zoomed(event)
    {
        g.attr('transform', event.transform);
    }

    function reset()
    {
        svg.transition().duration(500).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }
}
