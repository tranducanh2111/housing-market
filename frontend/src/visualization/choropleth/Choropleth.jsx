import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Choropleth.css';
import usStates from './us-states.json';
import statePrices from './state-prices.json';
import { Legend } from './colorLegend';
import { formatPrice } from '../utils';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const Choropleth = () => {
    const chartRef = useRef(null);
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        const drawChoropleth = async () => {
            const containerWidth = width * 0.6; // 80% of window width
            const containerHeight = height * 0.6; // 60% of window height

            // Clear any existing SVG
            d3.select(chartRef.current).selectAll('*').remove();

            // Create SVG container
            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
                .attr('preserveAspectRatio', 'xMidYMid meet');

            // Calculate the scale factor for the map projection
            const scale = Math.min(containerWidth, containerHeight) * 1.2;
            
            // Update projection to use dynamic dimensions
            const projection = d3.geoAlbersUsa()
                .translate([containerWidth / 2, containerHeight / 2])
                .scale(scale);

            const path = d3.geoPath().projection(projection);

            const priceMap = new Map(statePrices.map(d => [d['state'], d['price']]));

            const minHousePrice = d3.min(statePrices, d => d['price']);
            const maxHousePrice = d3.max(statePrices, d => d['price']);
            const colorScale = d3.scaleSequential([minHousePrice, maxHousePrice], d3.interpolateBlues)

            const zoom = d3.zoom()
                .scaleExtent([1, 6])
                .on('zoom', zoomed);

            svg.call(zoom);

            const g = svg.append('g');

            const states = g.selectAll('path')
                .data(usStates['features'])
                .enter()
                .append('path')
                .attr('class', 'state')
                .attr('d', path)
                .attr('id', getStateName)
                .attr('fill', getStateColor);

            states.on('click', (event) => { event.stopPropagation(); });

            const tooltip = d3.select('body')
                .append('div')
                .attr('id', 'tooltip')
                .style('visibility', 'hidden');

            states.on('mouseover', (event, d) => {
                d3.select(event.target).raise();

                const state = getStateName(d);
                let price = getStatePrice(d);
                let tooltipText = `No data for ${state}`;

                if (price !== -1) {
                    tooltipText = `State: ${state}\nPrice: ${formatPrice(price)} USD`;
                }

                tooltip.style('visibility', 'visible')
                    .text(tooltipText);
            });

            states.on('mousemove', (event) => {
                tooltip.style('top', event.pageY - 20 + 'px')
                    .style('left', event.pageX + 20 + 'px');
            });

            states.on('mouseout', (event) => {
                d3.select(event.target).attr('stroke-width', 0);
                tooltip.style('visibility', 'hidden');
            });

            svg.on('click', reset);

            // add color legend
            svg.append('g')
                .attr('id', 'state-choropleth-legend')
                .attr('transform', 'translate(610, 20)')
                .append(() => Legend(colorScale, {title: 'Price (USD)', width: 260}));

            function getStateName(d) {
                return d['properties']['NAME'];
            }

            function getStatePrice(d) {
                return priceMap.get(getStateName(d)) || -1;
            }

            function getStateColor(d) {
                return colorScale(getStatePrice(d));
            }

            function zoomed(event) {
                g.attr('transform', event.transform);
            }

            function reset() {
                svg.transition().duration(500).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([containerWidth / 2, containerHeight / 2])
                );
            }
        };

        drawChoropleth();
    }, [width, height]);

    return (
        <div className="choropleth-container w-full h-full">
            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default Choropleth;
