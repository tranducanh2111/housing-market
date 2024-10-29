Promise.all([d3.json('us-states.json'), d3.json('state-prices.json')])
    .then(([geoJSON, statePrices]) =>
    {
        drawChoropleth(geoJSON, statePrices);
    }).catch((error) =>
{
    console.error(`Failed to create US state choropleth: ${error}`);
})

/*
 * Function for creating the US state choropleth map.
 * 
 * @param {json} geoJson: Object that contains the geometry required for drawing the US states.
 * @param {json} statePrices: Object that contains the model's price prediction for each US state.
 */
function drawChoropleth(geoJson, statePrices)
{
    // create svg element
    const svgWidth = 1000;
    const svgHeight = 600;

    const svg = d3.select('body')
        .append('svg')
        .attr('id', 'state-choropleth-svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    // hash map that maps each state to a price predicted by the model
    const priceMap = new Map(statePrices.map(d => [d['state'], d['price']]));
    
    // geoAlbersUsa projection is used for transforming geo json geometry data into 2D screen coordinates
    const projection = d3.geoAlbersUsa()
        .scale([1000])
        .translate([svgWidth / 2, svgHeight / 2]);
    
    // line generator that works with geo json data. Is used for generating the state borders.
    const geoLineGenerator = d3.geoPath()
        .projection(projection);

    const minHousePrice = d3.min(statePrices, d => d['price']);
    const maxHousePrice = d3.max(statePrices, d => d['price']);
    const colorScale = d3.scaleSequential([minHousePrice, maxHousePrice], d3.interpolateBlues)

    // zooming and panning functionality
    const zoom = d3.zoom()
        .scaleExtent([1, 6])
        .on('zoom', zoomed);
    
    svg.call(zoom);

    // create the map
    const g = svg.append('g');
    const states = g.selectAll('path')
        .data(geoJson['features'])
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', geoLineGenerator)
        .attr('id', getStateName)
        .attr('fill', getStateColor);

    // prevents map reset when user clicks on a state. The user will have to click outside the geometry.
    states.on('click', (event) => { event.stopPropagation(); });

    // tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden');

    states.on('mouseover', (event, d) =>
    {
        d3.select(event.target).raise(); // raise the state so that its outline isn't abstracted by nearby geometry

        const state = getStateName(d);
        let price = getStatePrice(d);
        let tooltipText = `No data for ${state}`;

        // if the price is -1, that means that there is no data for that state. This is guaranteed for Alaska.
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

    // resets map view when the user clicks on blank svg area
    svg.on('click', reset);

    // add color legend
    svg.append('g')
        .attr('id', 'state-choropleth-legend')
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
            d3.zoomTransform(svg.node()).invert([svgWidth / 2, svgHeight / 2])
        );
    }
}
