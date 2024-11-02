import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Choropleth.css';
import { Legend } from './colorLegend';
import { feature } from 'topojson-client';

const Choropleth = ({ data, selectedState }) => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

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

    useEffect(() => {
        if (!data || !dimensions.width || !dimensions.height) return;

        const drawChoropleth = async (geoJson, statePrices) => {
            const containerWidth = dimensions.width;
            const containerHeight = dimensions.height;

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
            const scale = Math.min(containerWidth, containerHeight) * 1.8;
            
            // Update projection to use dynamic dimensions
            const projection = d3.geoAlbersUsa()
                .translate([containerWidth / 2, containerHeight / 2])
                .scale(scale);

            const path = d3.geoPath().projection(projection);

            const priceMap = new Map(statePrices.map(d => [d.state, d.price]));

            const minHousePrice = d3.min(statePrices, d => d.price);
            const maxHousePrice = d3.max(statePrices, d => d.price);
            const colorScale = d3.scaleSequential([minHousePrice, maxHousePrice], d3.interpolateBlues);

            const zoom = d3.zoom()
                .scaleExtent([1, 6])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });

            svg.call(zoom);

            const g = svg.append('g');
            const states = g.selectAll('path')
                .data(geoJson.features)
                .enter()
                .append('path')
                .attr('class', 'state')
                .attr('d', path)
                .attr('id', d => d.properties.name)
                .attr('fill', d => colorScale(priceMap.get(d.properties.name) || 0));

            // Outline the selected state in red on initial load
            if (selectedState) {
                states.filter(d => d.properties.name === selectedState)
                    .style('stroke', 'red')
                    .style('stroke-width', '2');
            }

            // states.on('click', (event) => {
            //     event.stopPropagation();
            // });

            const tooltip = d3.select('body')
                .append('div')
                .attr('id', 'tooltip')
                .style('visibility', 'hidden');

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

            states.on('mousemove', (event) => {
                tooltip.style('top', event.pageY - 20 + 'px')
                    .style('left', event.pageX + 20 + 'px');
            });

            states.on('mouseout', (event, d) => {
                const stateName = d.properties.name;
                d3.select(event.target)
                    .style('stroke', stateName === selectedState ? 'red' : 'white')
                    .style('stroke-width', stateName === selectedState ? '2' : '1');

                tooltip.style('visibility', 'hidden');
            });

            svg.on('click', () => {
                svg.transition().duration(500).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([containerWidth / 2, containerHeight / 2])
                );
            });

            // add color legend
            svg.append('g')
                .attr('id', 'state-choropleth-legend')
                .attr('transform', `translate(${containerWidth - 260}, 20)`)
                .append(() => Legend(colorScale, { title: 'Price (USD)', width: 260 }));

            function getStateName(d) {
                return d['properties']['NAME'];
            }

            function getStatePrice(d) {
                return priceMap.get(getStateName(d)) || -1;
            }

            function getStateColor(d) {
                return colorScale(getStatePrice(d));
            }
        };

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

        return () => {
            d3.select('body').selectAll('#tooltip').remove();
        };
    }, [data, dimensions, selectedState]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default Choropleth;
