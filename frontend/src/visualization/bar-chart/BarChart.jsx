import React, { useEffect, useRef, useState, useCallback } from 'react';
import { formatPrice } from "../utils";
import * as d3 from 'd3';
import './BarChart.css';

/**
 * BarChart Component
 * A responsive and interactive bar chart component built with D3.js and React
 * Features include:
 * - Responsive design with ResizeObserver
 * - Interactive tooltips
 * - Sorting capabilities (Alphabetical, Ascending, Descending)
 * - Highlighting selected city
 * - Smooth transitions
 * - Fixed y-axis with scrollable content
 * 
 * @param {Object[]} data - Array of objects containing city and price data
 * @param {string} selectedCity - Currently selected city to highlight
 */
const BarChart = ({ data, selectedCity}) =>
{
    // Refs for DOM elements
    const chartRef = useRef(null);          // Reference for main chart container
    const containerRef = useRef(null);       // Reference for outer container
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() =>
    {
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

    const drawBarChart = useCallback((data) =>
    {
        // Clear any existing SVG
        d3.select(chartRef.current).selectAll('svg').remove();

        const containerWidth = dimensions.width;
        const containerHeight = dimensions.height;

        const marginTop = 40;
        const marginRight = 20;
        const marginBottom = 80;
        const marginLeft = 60;

        // hash map containing the sorting functions for the chart's order
        const orderMap = new Map([
            ['Alphabetical', (a, b) => d3.ascending(a['city'], b['city'])],
            ['Ascending', (a, b) => d3.ascending(a['price'], b['price'])],
            ['Descending', (a, b) => d3.descending(a['price'], b['price'])]
        ]);

        // initially , have the data sorted alphabetically
        data.sort(orderMap.get('Alphabetical'));

        // create svg
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // x-axis scaler
        const xAxisScaler = getXaxisScaler();
        const rangeLeft = xAxisScaler.range()[1];

        // y-axis scaler
        const yAxisScaler = d3.scaleLinear()
            .domain([0, d3.max(data, d => d['price'])])
            .nice()
            .range([containerHeight - marginBottom, marginTop]);

        // axes generators
        const xAxisGenerator = d3.axisBottom(xAxisScaler).tickSizeOuter(0);
        const yAxisGenerator = d3.axisLeft(yAxisScaler).tickSize(0);

        // horizontal dashed gridlines
        svg.selectAll('line.bar-chart-horizontal-gridline')
            .data(yAxisScaler.ticks())
            .enter()
            .append('line')
            .attr('class', 'bar-chart-horizontal-gridline')
            .attr('x1', marginLeft)
            .attr('y1', d => yAxisScaler(d))
            .attr('x2', containerWidth)
            .attr('y2', d => yAxisScaler(d));

        // bars
        const bars = svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('id', d => d['city'])
            .attr('x', d => xAxisScaler(d['city']))
            .attr('y', d => yAxisScaler(d['price']))
            .attr('width', xAxisScaler.bandwidth())
            .attr('height', d => yAxisScaler(0) - yAxisScaler(d['price']));

        // x-axis creation
        svg.append('g')
            .attr('class', 'bar-chart-axis')
            .attr('id', 'bar-chart-x-axis')
            .attr('transform', `translate(0, ${containerHeight - marginBottom})`)
            .call(xAxisGenerator);

        // y-axis creation
        svg.append('g')
            .attr('class', 'bar-chart-axis')
            .attr('id', 'bar-chart-y-axis')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .call(yAxisGenerator)
            .call(g => g.select('.domain').remove());

        // x-axis legend
        svg.append('text')
            .attr('class', 'legend-text')
            .attr('id', 'x-axis-legend-text')
            .attr('x', containerWidth / 2)
            .attr('y', containerHeight - 4)
            .text('City')

        // y-axis legend
        svg.append('text')
            .attr('class', 'legend-text')
            .attr('id', 'y-axis-legend-text')
            .attr('x', 18)
            .attr('y', 20)
            .text('↑ Price (USD)')

        // pan by scrolling functionality
        let transform = d3.zoomIdentity;
        const maxPan = containerWidth - rangeLeft;
        svg.on('wheel', (event) =>
        {
            event.preventDefault(); // block page scroll on event

            // convert vertical delta to horizontal translation
            transform = transform.translate(-event.deltaY * 0.6, 0);
            transform.x = Math.max(maxPan, Math.min(0, transform.x));

            svg.select('#bar-chart-x-axis').attr('transform', `translate(${transform.x}, ${containerHeight - marginBottom})`);
            svg.selectAll('.bar').attr('transform', `translate(${transform.x}, 0)`);
        });

        // handle bar sorting
        d3.select('#bar-chart-order').on('change', (event) => orderBars(event.target.value));

        // tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('visibility', 'hidden');

        bars.on('mouseover', (event, d) =>
        {
            tooltip.style('visibility', 'visible')
                .text(`City: ${d['city']}\nPrice: ${formatPrice(d['price'])} USD`);
        });

        bars.on('mousemove', (event) =>
        {
            tooltip.style('top', event.pageY - 20 + 'px')
                .style('left', event.pageX + 40 + 'px');
        });

        bars.on('mouseout', (event) =>
        {
            d3.select(event.target).attr('stroke-width', 0);
            tooltip.style('visibility', 'hidden');
        });

        /*
        * Function that creates the x-axis scaler. This ensures that the chart will contain at most 37 bars in view, in
        * order to avoid the label strings overlapping. In this case, the user will have to scroll to view the rest of
        * the bars.
        * */
        function getXaxisScaler()
        {
            const dataLength = data.length;
            const maxBars = 20;

            const maxDimensions = d3.scaleBand()
                .domain(d3.range(maxBars).map(i => `${i + 1}`))
                .range([marginLeft, containerWidth - marginRight])
                .padding(0.2);

            const maxBarWidth = maxDimensions.bandwidth();
            const maxPaddingWidth = maxDimensions.step() - maxDimensions.bandwidth();

            const axisWidth = containerWidth - marginLeft - marginRight;
            const currentWidth = dataLength * maxBarWidth + (dataLength + 1) * maxPaddingWidth;

            const calculatedWidth = Math.max(axisWidth, currentWidth);

            return d3.scaleBand()
                .domain(data.map(d => d['city']))
                .range([marginLeft, calculatedWidth + marginLeft])
                .padding(0.2);
        }

        /*
        * Function used for ordering the x-axis (cities). The order can either be alphabetical, ascending (price), and
        * descending (price).
        * */
        function orderBars(order)
        {
            // sort the data
            data.sort(orderMap.get(order));

            // create new domain for x-axis
            xAxisScaler.domain(data.map(d => d['city']));

            const t = d3.transition().duration(2000);

            // transition for the x-axis
            svg.select('#bar-chart-x-axis')
                .transition(t)
                .call(xAxisGenerator);

            // transition for the bars
            svg.selectAll('.bar')
                .transition(t)
                .attr('x', d => xAxisScaler(d['city']));
        }

    }, [dimensions, selectedCity]);

    useEffect(() => {
        if (data && dimensions.width && dimensions.height)
            drawBarChart(data);
    }, [data, drawBarChart, dimensions]);

    // Cleanup function
    useEffect(() => {
        return () => {
            // Remove bar chart tooltip when component unmounts
            d3.selectAll('.bar-chart-tooltip').remove();
        };
    }, []);

    return (
        <div ref={containerRef} className="bar-chart-container w-full h-full">
            <form id="plot-form" className="mb-4">
                <label htmlFor="bar-chart-order" className="mr-2 text-body-sm sm:text-body">Sort by</label>
                <select
                    id="bar-chart-order"
                    className="border rounded p-1 text-body-sm sm:text-body">

                    <option value="Alphabetical">Alphabetical</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                </select>
            </form>
            <div ref={chartRef} className="chart-container min-w-full h-full"></div>
        </div>
    );
};

export default BarChart;
