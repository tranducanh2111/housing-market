/*
* Filename: Choropleth.jsx
* Author: John Iliadis - 104010553
*
* References:
* - https://observablehq.com/@d3/zoom-to-bounding-box
* - https://observablehq.com/@d3/us-state-choropleth/2
* */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Legend } from './colorLegend';
import { feature } from 'topojson-client';
import { formatPrice, observeContainerSize, tooltipHover } from "../utils";
import geoJson from "./us.json"
import './Choropleth.css'

/**
 * Choropleth Component
 * Creates an interactive US state map visualization with color-coded price data
 * Features include zoom, hover effects, and tooltips
 * 
 * @param {Object[]} data - Array of objects containing state price data
 * @param {string} selectedState - Currently selected state to highlight
 */
const Choropleth = ({ data, selectedState }) => {
    // Refs for D3 chart and container elements
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    
    // State for managing responsive dimensions
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Set up ResizeObserver for responsive behavior
    useEffect(() => observeContainerSize(containerRef, setDimensions), [containerRef]);

    function drawChoropleth()
    {
        // Clear any existing SVG
        d3.select(chartRef.current).selectAll('*').remove();

        // hash map that maps each state to a price predicted by the model
        const priceMap = new Map(data.map(d => [d['state'], d['price']]));

        // create color scale based on the min and max state price 
        const minHousePrice = d3.min(data, d => d['price']);
        const maxHousePrice = d3.max(data, d => d['price']);
        const colorScale = d3.scaleSequential([minHousePrice, maxHousePrice], d3.interpolateBlues)

        // create svg element
        const containerWidth = dimensions.width;
        const containerHeight = dimensions.height;
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .attr('viewBox', [0, 0, 975, 610])
            .attr('style', 'max-width: 100%; height: auto;')
            .on('click', reset);

        // line generator that works with geo json data. Is used for generating the state borders.
        const geoLineGenerator = d3.geoPath();

        // draw the states
        const getStateID = (d) => getStateName(d) === selectedState
            ? 'selected-state'
            : getStateName(d);

        const g = svg.append('g');
        const states = g.append('g')
            .selectAll('path')
            .data(feature(geoJson, geoJson.objects.states).features)
            .join('path')
            .attr('class', 'state')
            .attr('id', getStateID)
            .attr('fill', getStateColor)
            .attr('d', geoLineGenerator);

        d3.select('#selected-state').raise();

        // zooming and panning functionality
        const zoom = d3.zoom()
            .scaleExtent([1, 4])
            .on('zoom', (event) => { g.attr('transform', event.transform); });
        svg.call(zoom);

        // Create the tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip') // Ensure the ID matches the CSS
            .style('visibility', 'hidden')
            .style('position', 'absolute')
            .style('background', 'rgba(69,77,93,.9)')
            .style('border-radius', '.5rem')
            .style('color', '#fff')
            .style('box-shadow', '0 0 5px #999999')
            .style('font-size', '14px')
            .style('padding', '.2rem .4rem')
            .style('z-index', '9999');

        // Update event listeners
        states.on('mouseover', (event, d) => {
            d3.select(event.target).raise();
            d3.select('#selected-state').raise();
            tooltip.interrupt();
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
            tooltip.style('top', (event.pageY - 20) + 'px')
                .style('left', (event.pageX + 20) + 'px');
        });

        states.on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });

        // color legend
        svg.append('g')
            .attr('id', 'state-choropleth-legend')
            .attr('transform', 'translate(600, 0) scale(1.4)')
            .append(() => Legend(colorScale, {title: 'Price (USD)', width: 200}));

        // resets map view when the user clicks on the svg
        function reset()
        {
            svg.transition().duration(400).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([containerWidth / 2, containerHeight / 2])
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

    useEffect(() => {
        d3.select('#choropleth-tooltip').remove();
        drawChoropleth();
    }, [data, dimensions]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default Choropleth;