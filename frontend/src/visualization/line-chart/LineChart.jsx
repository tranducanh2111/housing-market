import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import './LineChart.css';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const LineChart = ({ livingAreaData, landAreaData }) => {
    const chartRef = useRef(null);
    const [areaType, setAreaType] = useState('living_area');
    const { width, height } = useWindowDimensions();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    const calculateDomainValues = (data, areaType) => {
        const minPrice = d3.min(data, d => d['price']);
        const maxPrice = d3.max(data, d => d['price']);
        const minArea = d3.min(data, d => d[areaType]);
        const maxArea = d3.max(data, d => d[areaType]);
        return [minPrice, maxPrice, minArea, maxArea];
    };

    const drawLineChart = useCallback((livingAreaPrice, landAreaPrice) => {
        const containerWidth = width * 0.8;
        const containerHeight = height * 0.6;

        // Clear any existing SVG
        d3.select(chartRef.current).selectAll('*').remove();

        // Create SVG container with a foreign object for labels
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Initialize x and y axes scalers
        const x = d3.scaleLinear().range([65, containerWidth - 50]);
        const y = d3.scaleLinear().range([containerHeight - 30, 20]);

        // Initialize x-axis
        svg.append('g')
            .attr('class', 'line-chart-axis')
            .attr('id', 'line-chart-x-axis')
            .attr('transform', `translate(0,${containerHeight - 30})`);

        // Initialize y-axis
        svg.append('g')
            .attr('class', 'line-chart-axis')
            .attr('id', 'line-chart-y-axis')
            .attr('transform', `translate(${65}, 0)`);

        // Add X-axis label using foreignObject
        svg.append('foreignObject')
            .attr('x', containerWidth / 2 - 100)
            .attr('y', containerHeight - 20)
            .attr('width', 200)
            .attr('height', 30)
            .append('xhtml:div')
            .style('text-align', 'center')
            .style('font-size', '1rem')
            .text('Living/Land Area (m²)');

        // Add Y-axis label using foreignObject
        svg.append('foreignObject')
            .attr('x', -containerHeight / 2 - 50)
            .attr('y', 0)
            .attr('width', containerHeight)
            .attr('height', 30)
            .append('xhtml:div')
            .style('text-align', 'center')
            .style('font-size', '1rem')
            .style('transform', 'rotate(-90deg)')
            .style('transform-origin', 'center')
            .text('Price (USD)');

        // Tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('visibility', 'hidden');

        // Create graph
        update(areaType, 0);

        function update(areaType, t) {
            const data = areaType === 'living_area' ? livingAreaPrice : landAreaPrice;
            const [minPrice, maxPrice, minArea, maxArea] = calculateDomainValues(data, areaType);

            x.domain([minArea, maxArea]);
            y.domain([minPrice, maxPrice]);

            const xTickValues = d3.range(minArea, maxArea + 1, (maxArea - minArea) / 10);
            const yTickValues = d3.range(minPrice, maxPrice + 1, (maxPrice - minPrice) / 10);

            const xAxis = d3.axisBottom(x).tickSize(10).tickValues(xTickValues);
            const yAxis = d3.axisLeft(y).tickSize(10).tickValues(yTickValues);

            svg.select('#line-chart-x-axis')
                .transition()
                .duration(t)
                .call(xAxis);

            svg.select('#line-chart-y-axis')
                .transition()
                .duration(t)
                .call(yAxis);

            svg.select('#line-chart-x-axis .domain').remove();
            svg.select('#line-chart-y-axis .domain').remove();

            // Horizontal grid lines
            svg.selectAll('line.line-chart-horizontal-gridline')
                .data(yTickValues)
                .join('line')
                .attr('class', 'line-chart-horizontal-gridline')
                .attr('x1', 65)
                .attr('y1', d => y(d))
                .attr('x2', containerWidth - 50)
                .attr('y2', d => y(d))
                .attr('stroke', 'black')
                .attr('stroke-width', 0.5);

            // Vertical grid lines
            svg.selectAll('line.line-chart-vertical-gridline')
                .data(xTickValues)
                .join('line')
                .attr('class', 'line-chart-vertical-gridline')
                .attr('x1', d => x(d))
                .attr('y1', containerHeight - 30)
                .attr('x2', d => x(d))
                .attr('y2', 20)
                .attr('stroke', 'black')
                .attr('stroke-width', 0.5);

            // Create the line generator
            const lineGenerator = d3.line()
                .x(d => x(d[areaType]))
                .y(d => y(d['price']));

            // Update the line
            svg.selectAll('.chart-line')
                .data([data])
                .join('path')
                .attr('class', 'chart-line')
                .transition()
                .duration(t)
                .attr('d', lineGenerator)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 2.5);

            // Update dots
            const dots = svg.selectAll('.line-chart-dot')
                .data(data)
                .join('circle')
                .attr('class', 'line-chart-dot')
                .attr('fill', 'steelblue')
                .attr('r', 4)
                .transition()
                .duration(t)
                .attr('cx', d => x(d[areaType]))
                .attr('cy', d => y(d['price']));

            // Update hover dots for tooltip
            const hoverDots = svg.selectAll('.line-chart-hover-dot')
                .data(data)
                .join('circle')
                .attr('class', 'line-chart-hover-dot')
                .attr('r', 10)
                .attr('fill', 'steelblue')
                .style('opacity', 0)
                .attr('cx', d => x(d[areaType]))
                .attr('cy', d => y(d['price']));

            // Update hover functionality
            hoverDots.on('mouseover', (event, d) => {
                d3.select(event.target).style('opacity', 1);
                tooltip.style('visibility', 'visible')
                    .text(`${areaType === 'living_area' ? 'Living' : 'Land'} area: ${d[areaType]} m²\nPrice: ${formatPrice(d['price'])} USD`);
            });

            hoverDots.on('mousemove', (event) => {
                tooltip.style('top', event.pageY - 20 + 'px')
                    .style('left', event.pageX + 20 + 'px');
            });

            hoverDots.on('mouseout', (event) => {
                d3.select(event.target).style('opacity', 0);
                tooltip.style('visibility', 'hidden');
            });
        }
    }, [width, height, areaType]);

    useEffect(() => {
        if (livingAreaData && landAreaData) {
            drawLineChart(livingAreaData, landAreaData);
        }
    }, [drawLineChart, livingAreaData, landAreaData]);

    const handleAreaChange = (event) => {
        setAreaType(event.target.value);
    };

    return (
        <div className="line-chart-container w-full max-h-[25rem] h-full">
            <form>
                <label>
                    <input
                        type="radio"
                        name="area"
                        value="living_area"
                        checked={areaType === 'living_area'}
                        onChange={handleAreaChange}
                    />
                    Living Area
                </label>
                <br />
                <label>
                    <input
                        type="radio"
                        name="area"
                        value="land_area"
                        checked={areaType === 'land_area'}
                        onChange={handleAreaChange}
                    />
                    Land Area
                </label>
            </form>

            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default LineChart;