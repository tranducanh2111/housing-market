Promise.all([d3.json('us.json'), d3.json('state-prices.json')])
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
function drawChoropleth(geoJSON, statePrices)
{
    // hash map that maps each state to a price predicted by the model
    const priceMap = new Map(statePrices.map(d => [d['state'], d['price']]));

    // create color scale based on the min and max state price 
    const minHousePrice = d3.min(statePrices, d => d['price']);
    const maxHousePrice = d3.max(statePrices, d => d['price']);
    const colorScale = d3.scaleSequential([minHousePrice, maxHousePrice], d3.interpolateBlues)

    // create svg element
    const svgWidth = 975;
    const svgHeight = 610;
    const svg = d3.select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', [0, 0, svgWidth, svgHeight])
        .attr('style', 'max-width: 100%; height: auto;')
        .on('click', reset);

    // line generator that works with geo json data. Is used for generating the state borders.
    const geoLineGenerator = d3.geoPath();

    // draw the states
    const g = svg.append('g');
    const states = g.append('g')
        .selectAll('path')
        .data(topojson.feature(geoJSON, geoJSON.objects.states).features)
        .join('path')
        .attr('class', 'state')
        .attr('id', getStateName)
        .attr('fill', getStateColor)
        .attr('d', geoLineGenerator);

    // draw borders
    g.append('path')
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 1.2)
        .attr('stroke-linejoin', 'round')
        .attr('d', geoLineGenerator(topojson.mesh(geoJSON, geoJSON.objects.states, (a, b) => a !== b)));

    // zooming and panning functionality
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => { g.attr('transform', event.transform); });
    svg.call(zoom);

    // tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .style('opacity', 0);
    
    states.on('mouseover', (event, d) =>
    {
        tooltip.interrupt();
        const state = getStateName(d);
        let price = getStatePrice(d);
        let tooltipText = `No data for ${state}`;

        // if the price is -1, that means that there is no data for that state. This is guaranteed for Alaska.
        if (price !== -1)
        {
            tooltipText = `State: ${state}\nPrice: ${formatPrice(price)} USD`;
        }

        tooltip
            .style('opacity', 1)
            .text(tooltipText);
    });

    states.on('mousemove', (event) =>
    {
        tooltip.style('top', event.pageY - 20 + 'px')
            .style('left', event.pageX + 20 + 'px');
    });

    states.on('mouseout', () =>
    {
        // tooltip fades out on exit
        tooltip
            .transition()
            .duration(400)
            .style('opacity', 0);
    });
    
    // color legend
    svg.append('g')
        .attr('id', 'state-choropleth-legend')
        .attr('transform', 'translate(620, 0)')
        .append(() => Legend(colorScale, {title: 'Price (USD)', width: 260}));

    // resets map view when the user clicks on the svg
    function reset()
    {
        svg.transition().duration(400).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([svgWidth / 2, svgHeight / 2])
        );
    }

    function getStateName(d)
    {
        return d['properties']['name'];
    }

    function getStatePrice(d)
    {
        return priceMap.get(getStateName(d)) || -1;
    }

    function getStateColor(d)
    {
        return colorScale(getStatePrice(d));
    }
}
