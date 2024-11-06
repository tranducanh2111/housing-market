/*
* Filename: LineChart.jsx
* Author: John Iliadis - 104010553
*
* References:
* - https://d3-graph-gallery.com/graph/line_change_data.html
* */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {formatPrice, observeContainerSize, tooltipHover } from '../utils.js'
import * as d3 from 'd3';
import './LineChart.css';

const LineChart = ({ livingAreaData, landAreaData, predictionResult }) => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedArea, setSelectedArea] = useState('living_area');

    useEffect(() => observeContainerSize(containerRef, setDimensions), [containerRef]);

    const drawLineChart = useCallback((livingAreaPrice, landAreaPrice) => {
        const containerWidth = dimensions.width;
        const containerHeight = dimensions.height;

        const marginTop = 40;
        const marginRight = 20;
        const marginBottom = 50;
        const marginLeft = 60;

        // Clear any existing SVG
        d3.select(chartRef.current).selectAll('*').remove();

        // Create SVG container with a foreign object for labels
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // get the min and max price from both datasets
        const minPrice = Math.min(d3.min(livingAreaPrice, d => d['price']), d3.min(landAreaPrice, d => d['price']));
        const maxPrice = Math.max(d3.max(livingAreaPrice, d => d['price']), d3.max(landAreaPrice, d => d['price']));
        const xAxisDomainPadding = 10;
        const yAxisDomainPadding = 10;

        // initialize x-axis scaler
        const xAxisScaler = d3.scaleLinear()
            .range([marginLeft, containerWidth - marginRight]);

        // initialize x-axis
        svg.append('g')
            .attr('class', 'line-chart-axis')
            .attr('id', 'line-chart-x-axis')
            .attr('transform', `translate(0,${containerHeight - marginBottom})`);

        // initialize y-axis scaler
        const [yLowerBound, yUpperBound] = calculateAxisDomain(minPrice, maxPrice, yAxisDomainPadding);
        const yAxisScaler = d3.scaleLinear()
            .domain([yLowerBound, yUpperBound])
            .range([containerHeight - marginBottom, marginTop]);

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
            .call(g => g.select(".domain").remove());

        // horizontal grid lines
        svg.selectAll('line.line-chart-horizontal-gridline')
            .data(yTickValues)
            .enter()
            .append('line')
            .attr('class', 'line-chart-horizontal-gridline')
            .attr('x1', marginLeft)
            .attr('y1', d => yAxisScaler(d))
            .attr('x2', containerWidth - marginRight)
            .attr('y2', d => yAxisScaler(d))
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5);

        // x-axis legend
        svg.append('text')
            .attr('class', 'legend-text')
            .attr('id', 'x-axis-legend-text')
            .attr('x', containerWidth / 2)
            .attr('y', containerHeight - 4)
            .text('Area m²')

        // y-axis legend
        svg.append('text')
            .attr('class', 'legend-text')
            .attr('id', 'y-axis-legend-text')
            .attr('x', 8)
            .attr('y', 20)
            .text('↑ Price (USD)')

        // Remove any existing tooltips
        // d3.select(containerRef.current).selectAll('#tooltip').remove();

        // Create new tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('id', 'line-chart-tooltip')
            .style('visibility', 'hidden');

        d3.selectAll('input[name="area"]')
            .on('change', function() { 
                setSelectedArea(this.value);
                update(this.value, 800); 
            });

        // Create graph with current selected area
        update(selectedArea, 0);
        update(selectedArea, 0); // DO NOT REMOVE THIS LINE

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

            // Vertical grid lines
            svg.selectAll('line.line-chart-vertical-gridline')
                .data(xTickValues)
                .join('line')
                .attr('class', 'line-chart-vertical-gridline')
                .attr('x1', d => xAxisScaler(d))
                .attr('y1', containerHeight - marginBottom)
                .attr('x2', d => xAxisScaler(d))
                .attr('y2', marginTop)
                .attr('stroke', 'black')
                .attr('stroke-width', 0.5);

            // Create the line generator
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
                .attr('fill', 'none');

            // Update dots
            const dots = svg.selectAll('.line-chart-dot').data(data);
            dots.enter()
                .append('circle')
                .attr('class', 'line-chart-dot')
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
                tooltipHover(tooltip, event);
            });

            hoverDots.on('mouseout', (event) => {
                d3.select(event.target).style('opacity', 0);
                tooltip.style('visibility', 'hidden');
            });

            // Add prediction point if available
            if (predictionResult)
            {
                const predictionPoint = {
                    price: predictionResult.prediction,
                    area: areaType === 'living_area'
                        ? predictionResult['property-details']['living-area']
                        : predictionResult['property-details']['land-area']
                };

                svg.selectAll('.prediction-dot')
                    .data([predictionPoint])
                    .join('circle')
                    .attr('class', 'prediction-dot')
                    .attr('r', 10)
                    .attr('cx', d => xAxisScaler(d['area']))
                    .attr('cy', d => yAxisScaler(d['price']));

                // Add hover functionality for prediction dot
                svg.selectAll('.prediction-hover-dot')
                    .data([predictionPoint])
                    .join('circle')
                    .attr('class', 'prediction-hover-dot')
                    .attr('r', 16)
                    .attr('cx', d => xAxisScaler(d['area']))
                    .attr('cy', d => yAxisScaler(d['price']))
                    .on('mouseover', (event, d) => {
                        d3.select(event.target).style('opacity', 0.3);
                        const areaTypeText = areaType === 'living_area' ? 'Living area' : 'Land area';
                        tooltip.style('visibility', 'visible')
                            .text(`${areaTypeText}: ${d['area']} m²\nPrice: ${formatPrice(d['price'])} USD`);
                    })
                    .on('mousemove', (event) => {
                        tooltipHover(tooltip, event);
                    })
                    .on('mouseout', (event) => {
                        d3.select(event.target).style('opacity', 0);
                        tooltip.style('visibility', 'hidden');
                    });
            }
        }
    }, [dimensions, predictionResult, selectedArea]);

    function calculateAxisDomain(lowerBound, upperBound, paddingPercent)
    {
        const padding = (upperBound - lowerBound) / paddingPercent;
        const lb = lowerBound - padding;
        const ub = upperBound + padding;

        return [lb, ub];
    }

    useEffect(() => {
        if (livingAreaData && landAreaData) {
            d3.selectAll('#line-chart-tooltip').remove();
            drawLineChart(livingAreaData, landAreaData);
        }

    }, [drawLineChart, livingAreaData, landAreaData, selectedArea]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <form>
                <label>
                    <input type="radio"
                           name="area"
                           value="living_area"
                           className='mr-2'
                           checked={selectedArea === 'living_area'}
                           onChange={() => setSelectedArea('living_area')}/>
                    Living Area
                </label><br/>
                <label>
                    <input type="radio"
                           name="area"
                           value="land_area"
                           className='mr-2'
                           checked={selectedArea === 'land_area'}
                           onChange={() => setSelectedArea('land_area')}/>
                    Land Area
                </label>
            </form>
            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default LineChart;