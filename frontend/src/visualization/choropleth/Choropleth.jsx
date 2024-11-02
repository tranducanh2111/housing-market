import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Legend } from './colorLegend';
import { feature } from 'topojson-client';

/**
 * Choropleth Component
 * Creates an interactive US state map visualization with color-coded price data
 * Features include zoom, hover effects, tooltips, and animated state rendering
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

    /**
     * Formats price numbers with appropriate commas
     * @param {number} price - The price to format
     * @returns {string} Formatted price string
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    // Set up ResizeObserver for responsive behavior
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Main effect for drawing and updating the choropleth map
    useEffect(() => {
        if (!data || !dimensions.width || !dimensions.height) return;

        /**
         * Main function to draw the choropleth map
         * @param {Object} geoJson - GeoJSON data for US states
         * @param {Object[]} statePrices - Array of state price data
         */
        const drawChoropleth = async (geoJson, statePrices) => {
            const containerWidth = dimensions.width;
            const containerHeight = dimensions.height;

            // Clear existing SVG
            d3.select(chartRef.current).selectAll('*').remove();

            // Create main SVG container
            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
                .attr('preserveAspectRatio', 'xMidYMid meet');

            // Calculate map scale based on container size
            const scale = Math.min(containerWidth, containerHeight) * 1.8;
            
            // Set up US map projection
            const projection = d3.geoAlbersUsa()
                .translate([containerWidth / 2, containerHeight / 2])
                .scale(scale);

            // Create path generator for map features
            const path = d3.geoPath().projection(projection);

            // Create map of state prices for easy lookup
            const priceMap = new Map(statePrices.map(d => [d.state, d.price]));

            // Set up color scale for price visualization
            const minHousePrice = d3.min(statePrices, d => d.price);
            const maxHousePrice = d3.max(statePrices, d => d.price);
            const colorScale = d3.scaleSequential()
                .domain([minHousePrice, maxHousePrice])
                .interpolator(d3.interpolate('#E8EEF1', '#0E4459'));

            // Configure zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([1, 6]) // Limit zoom range
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });

            svg.call(zoom);

            // Create group for map elements
            const g = svg.append('g');
            
            // Create and animate state paths
            const states = g.selectAll('path')
                .data(geoJson.features)
                .enter()
                .append('path')
                .attr('class', 'state')
                .attr('d', path)
                .attr('id', d => d.properties.name)
                .attr('fill', d => colorScale(priceMap.get(d.properties.name) || 0))
                .style('transform', `translateX(${containerWidth}px)`) // Initial position for animation
                .style('opacity', 0);

            // Animate states flying in from right with staggered timing
            states.each(function(d, i) {
                d3.select(this)
                    .transition()
                    .delay(i * 30) // Stagger each state's animation
                    .duration(1500)
                    .style('transform', 'translateX(0px)')
                    .style('opacity', 1)
                    .ease(d3.easeBackOut.overshoot(1.1)); // Add bounce effect
            });

            // Highlight selected state if any
            if (selectedState) {
                states.filter(d => d.properties.name === selectedState)
                    .style('stroke', 'red')
                    .style('stroke-width', '2');
            }

            // Create tooltip
            const tooltip = d3.select('body').select('#tooltip');
            if (!tooltip.empty()) {
                tooltip.style('visibility', 'hidden');
            }

            // Add hover interactions
            states.on('mouseover', (event, d) => {
                d3.select(event.target).raise();
                d3.select(event.target)
                    .style('stroke', 'yellow')
                    .style('stroke-width', '2');

                const state = d.properties.name;
                const price = priceMap.get(state);
                const tooltipText = price 
                    ? `State: ${state}\nPrice: ${formatPrice(price)} USD`
                    : `No data for ${state}`;

                tooltip.style('visibility', 'visible')
                    .text(tooltipText);
            });

            // Handle tooltip positioning
            states.on('mousemove', (event) => {
                const tooltipNode = tooltip.node();
                const tooltipWidth = tooltipNode.offsetWidth;
                const windowWidth = window.innerWidth;
                const mouseX = event.pageX;
                
                // Prevent tooltip from overflowing window
                const wouldOverflowRight = mouseX + tooltipWidth + 20 > windowWidth;
                
                tooltip
                    .style('top', (event.pageY - 20) + 'px')
                    .style('left', wouldOverflowRight
                        ? (mouseX - tooltipWidth - 10) + 'px'
                        : (mouseX + 20) + 'px');
            });

            // Handle mouseout events
            states.on('mouseout', (event, d) => {
                const stateName = d.properties.name;
                d3.select(event.target)
                    .style('stroke', stateName === selectedState ? 'red' : 'white')
                    .style('stroke-width', stateName === selectedState ? '2' : '1');

                tooltip.style('visibility', 'hidden');
            });

            // Reset zoom on map click
            svg.on('click', () => {
                svg.transition().duration(500).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([containerWidth / 2, containerHeight / 2])
                );
            });

            // Add color legend
            svg.append('g')
                .attr('id', 'state-choropleth-legend')
                .attr('transform', `translate(${containerWidth - 260}, 20)`)
                .append(() => Legend(colorScale, { title: 'Price (USD)', width: 260 }));
        };

        /**
         * Fetches and processes US state geometry data
         * Uses topojson-client to convert TopoJSON to GeoJSON
         */
        const fetchGeoData = async () => {
            try {
                const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
                const us = await response.json();
                const usStates = feature(us, us.objects.states);
                drawChoropleth(usStates, data);
            } catch (error) {
                console.error('Error loading US states geometry:', error);
            }
        };

        fetchGeoData();

        // Cleanup tooltip on unmount
        return () => {
            // Hide tooltip before removing
            const tooltip = d3.select('body').select('#tooltip');
            if (!tooltip.empty()) {
                tooltip.style('visibility', 'hidden')
                    .remove();
            }
        };
    }, [data, dimensions, selectedState]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default Choropleth;