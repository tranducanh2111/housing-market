import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './BarChart.css';
import citiesPrices from './cities-prices.json';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const BarChart = () => {
    const chartRef = useRef(null);
    const { width, height } = useWindowDimensions();
    const [sortOrder, setSortOrder] = useState('Alphabetical');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    useEffect(() => {
        drawBarChart(citiesPrices);

        function drawBarChart(data) {
            const marginTop = 20;
            const marginRight = 0;
            const marginBottom = 60;
            const marginLeft = 65;

            const containerWidth = width;
            const containerHeight = height * 0.8;

            const orderMap = new Map([
                ['Alphabetical', (a, b) => d3.ascending(a['city'], b['city'])],
                ['Ascending', (a, b) => d3.ascending(a['price'], b['price'])],
                ['Descending', (a, b) => d3.descending(a['price'], b['price'])],
            ]);

            // Order data based on the selected sort order
            data.sort(orderMap.get(sortOrder));

            // Clear any existing SVG
            d3.select(chartRef.current).selectAll('*').remove();

            // Create SVG
            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('id', 'bar-chart-svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
                .attr('preserveAspectRatio', 'xMidYMid meet');

            // X-axis scaler
            const x = d3.scaleBand()
                .domain(data.map(d => d.city))
                .range([marginLeft, containerWidth - marginRight])
                .padding(0.1);

            // Y-axis scaler
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.price)])
                .range([containerHeight - marginBottom, marginTop]);

            // Append axes
            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0,${containerHeight - marginBottom})`)
                .call(d3.axisBottom(x));

            svg.append('g')
                .attr('class', 'y-axis')
                .attr('transform', `translate(${marginLeft}, 0)`)
                .call(d3.axisLeft(y));

            // Create bars
            svg.selectAll('.bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.city))
                .attr('y', d => y(d.price))
                .attr('width', x.bandwidth())
                .attr('height', d => containerHeight - marginBottom - y(d.price))
                .attr('fill', 'steelblue');

            // Add Y-axis label
            svg.append('text')
                .attr('class', 'y-axis-label')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${marginLeft / 2 - 32}, ${(containerHeight / 2)}) rotate(-90)`)
                .text('Price (USD)');

            // Add X-axis label
            svg.append('text')
                .attr('class', 'x-axis-label')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${containerWidth / 2}, ${containerHeight - marginBottom / 2 + 24})`)
                .text('City');
        }

        // Call the draw function
        drawBarChart(citiesPrices);
    }, [width, height, sortOrder]);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    return (
        <div className="bar-chart-container w-full max-h-[25rem] h-full">
            <form id="plot-form" className="mb-4">
                <label htmlFor="bar-chart-order" className="mr-2 text-body-sm sm:text-body">Sort by</label>
                <select id="bar-chart-order" value={sortOrder} onChange={handleSortChange} className="border rounded p-1 text-body-sm sm:text-body">
                    <option value="Alphabetical" className='text-body-sm sm:text-body'>Alphabetical</option>
                    <option value="Ascending" className='text-body-sm sm:text-body'>Ascending</option>
                    <option value="Descending" className='text-body-sm sm:text-body'>Descending</option>
                </select>
            </form>
            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default BarChart; 