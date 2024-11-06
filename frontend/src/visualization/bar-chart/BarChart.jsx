import React, { useEffect, useRef, useState, useCallback } from 'react';
import { formatPrice, observeContainerSize, tooltipHover } from "../utils";
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
const BarChart = ({ data, selectedCity}) => {
    const yAxisRef = useRef(null);          // Reference for y-axis
    const chartRef = useRef(null);          // Reference for main chart container
    const containerRef = useRef(null);       // Reference for outer container
    const scrollContainerRef = useRef(null); // Reference for scrollable container
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [currentOrder, setCurrentOrder] = useState('Alphabetical');

    useEffect(() => observeContainerSize(containerRef, setDimensions), [containerRef]);

    const drawBarChart = useCallback((data) => {
        // Clear existing SVGs
        d3.select(chartRef.current).selectAll('svg').remove();
        d3.select(yAxisRef.current).selectAll('svg').remove();

        const containerWidth = dimensions.width;
        const containerHeight = dimensions.height;

        const marginTop = 40;
        const marginRight = 20;
        const marginBottom = 80;
        const marginLeft = 45;

        // hash map containing the sorting functions for the chart's order
        const orderMap = new Map([
            ['Alphabetical', (a, b) => d3.ascending(a['city'], b['city'])],
            ['Ascending', (a, b) => d3.ascending(a['price'], b['price'])],
            ['Descending', (a, b) => d3.descending(a['price'], b['price'])]
        ]);

        // Sort data according to current order
        data.sort(orderMap.get(currentOrder));

        // x-axis scaler
        const xAxisScaler = getXaxisScaler();
        const rangeLeft = xAxisScaler.range()[1];

        // y-axis scaler
        const yAxisScaler = d3.scaleLinear()
            .domain([0, d3.max(data, d => d['price'])])
            .nice()
            .range([containerHeight - marginBottom, marginTop]);

        // Create Y-axis SVG
        const yAxisSvg = d3.select(yAxisRef.current)
            .append('svg')
            .attr('width', marginLeft)
            .attr('height', containerHeight)
            .attr('class', 'y-axis-svg');

        // Y-axis
        yAxisSvg.append('g')
            .attr('class', 'bar-chart-axis')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(yAxisScaler).tickSize(0))
            .call(g => g.select('.domain').remove());

        // Y-axis legend
        yAxisSvg.append('text')
            .attr('class', 'legend-text')
            .attr('x', 0)
            .attr('y', 20)
            .text('↑ Price (USD)');

        // Add domain line
        const maxPrice = d3.max(data, d => d['price']);
        yAxisSvg.append('line')
            .attr('x1', marginLeft) // Align with the y-axis
            .attr('y1', yAxisScaler(maxPrice)) // Position at max value
            .attr('x2', marginLeft + 10) // Extend line to the right
            .attr('y2', yAxisScaler(maxPrice))
            .attr('stroke', 'black') // Line color
            .attr('stroke-width', 2) // Line width
            .attr('class', 'domain-line'); // Optional class for styling

        // Draw a line at y=0 for the domain line
        yAxisSvg.append('line')
            .attr('x1', marginLeft) // Align with the y-axis
            .attr('y1', yAxisScaler(0)) // Position at y=0
            .attr('x2', marginLeft + 10) // Extend line to the right
            .attr('y2', yAxisScaler(0))
            .attr('stroke', 'black') // Line color
            .attr('stroke-width', 2) // Line width
            .attr('class', 'domain-line'); // Optional class for styling

        // Add vertical domain line
        yAxisSvg.append('line')
            .attr('x1', marginLeft) // Align with the y-axis
            .attr('y1', marginTop - 10) // Start at the top margin
            .attr('x2', marginLeft) // Vertical line, so x1 = x2
            .attr('y2', containerHeight - marginBottom) // End at the bottom margin
            .attr('stroke', 'black') // Line color
            .attr('stroke-width', 2) // Line width
            .attr('class', 'vertical-domain-line'); // Optional class for styling

        // Create main chart SVG
        const mainSvg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', rangeLeft)
            .attr('height', containerHeight)
            .attr('class', 'main-svg');

        // horizontal dashed gridlines
        mainSvg.selectAll('line.bar-chart-horizontal-gridline')
            .data(yAxisScaler.ticks())
            .enter()
            .append('line')
            .attr('class', 'bar-chart-horizontal-gridline')
            .attr('x1', 0)
            .attr('y1', d => yAxisScaler(d))
            .attr('x2', rangeLeft)
            .attr('y2', d => yAxisScaler(d));

        // bars
        const getBarID = (d) => d['city'].toLowerCase() === selectedCity.toLowerCase()
            ? 'selected-city'
            : d['city'];

        const bars = mainSvg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('id', getBarID)
            .attr('x', d => xAxisScaler(d['city']))
            .attr('y', d => yAxisScaler(d['price']))
            .attr('width', xAxisScaler.bandwidth())
            .attr('height', d => yAxisScaler(0) - yAxisScaler(d['price']));

        // x-axis
        mainSvg.append('g')
            .attr('class', 'bar-chart-axis')
            .attr('transform', `translate(0, ${containerHeight - marginBottom})`)
            .call(d3.axisBottom(xAxisScaler).tickSizeOuter(0))
            .selectAll('text')
            .attr('transform', 'rotate(45)')
            .attr('text-anchor', 'start')
            .attr('dx', '0.5em')
            .attr('dy', '0.5em');

        // x-axis legend
        // mainSvg.append('text')
        //     .attr('class', 'legend-text')
        //     .attr('x', rangeLeft / 2)
        //     .attr('y', containerHeight - 4)
        //     .text('City');

        // tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('visibility', 'hidden')
            .style('z-index', '9999');

        bars.on('mouseover', (event, d) => {
            tooltip.style('visibility', 'visible')
                .text(`City: ${d['city']}\nPrice: ${formatPrice(d['price'])} USD`);
        });

        bars.on('mousemove', (event) => {
            tooltipHover(tooltip, event);
        });

        bars.on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });

        function getXaxisScaler() {
            const dataLength = data.length;
            const maxBars = 20;

            const maxDimensions = d3.scaleBand()
                .domain(d3.range(maxBars).map(i => `${i + 1}`))
                .range([0, containerWidth - marginRight])
                .padding(0.2);

            const maxBarWidth = maxDimensions.bandwidth();
            const maxPaddingWidth = maxDimensions.step() - maxDimensions.bandwidth();

            const axisWidth = containerWidth - marginLeft - marginRight;
            const currentWidth = dataLength * maxBarWidth + (dataLength + 1) * maxPaddingWidth;

            const calculatedWidth = Math.max(axisWidth, currentWidth);

            return d3.scaleBand()
                .domain(data.map(d => d['city']))
                .range([0, calculatedWidth])
                .padding(0.2);
        }

        // handle bar sorting
        d3.select('#bar-chart-order').on('change', (event) => {
            setCurrentOrder(event.target.value);
            orderBars(event.target.value);
        });

        // handle scrolling to selected city
        d3.select("#bar-chart-button").on("click", scrollToSelectedCity);

        function orderBars(order) {
            // sort the data
            data.sort(orderMap.get(order));

            // create new domain for x-axis
            xAxisScaler.domain(data.map(d => d['city']));

            const t = d3.transition().duration(750);

            // transition for the x-axis
            mainSvg.select('.bar-chart-axis')
                .transition(t)
                .call(d3.axisBottom(xAxisScaler).tickSizeOuter(0));

            // transition for the bars
            mainSvg.selectAll('.bar')
                .transition(t)
                .attr('x', d => xAxisScaler(d['city']));
        }

        function scrollToSelectedCity() {
            const selectedBar = document.getElementById('selected-city');
            if (selectedBar) {
                selectedBar.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }

    }, [dimensions, selectedCity, currentOrder]);

    useEffect(() => {
        if (data && dimensions.width && dimensions.height)
            drawBarChart(data);
    }, [data, drawBarChart, dimensions]);

    // Cleanup function
    useEffect(() => {
        return () => {
            d3.selectAll('#tooltip').remove();
        };
    }, []);

    // Handle horizontal scrolling with mouse wheel
    useEffect(() => {
        const handleWheel = (event) => {
            if (scrollContainerRef.current) {
                event.preventDefault();
                scrollContainerRef.current.scrollLeft += event.deltaY;
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="bar-chart-container w-full h-full">
            <form id="plot-form" className="mb-4 flex justify-between items-center gap-2 flex-wrap">
                <div>
                    <label htmlFor="bar-chart-order" className="mr-2 text-body-sm sm:text-body">Sort by</label>
                    <select
                        id="bar-chart-order"
                        className="border rounded p-1 text-body-sm sm:text-body"
                        value={currentOrder}
                        onChange={(e) => setCurrentOrder(e.target.value)}
                    >
                        <option value="Alphabetical">Alphabetical</option>
                        <option value="Ascending">Price Ascending</option>
                        <option value="Descending">Price Descending</option>
                    </select>
                </div>
                <button
                    type="button"
                    id="bar-chart-button"
                    className="w-fit bg-primary text-white text-body-sm sm:text-body flex items-center justify-center text-body px-[9px] sm:px-[15px] py-[8px] h-[36px] rounded-md transition duration-300 ease-in-out"
                >
                    Go to selected city
                </button>
            </form>
            <div className="flex h-full">
                <div ref={yAxisRef} className="sticky left-0 z-10 bg-white"></div>
                <div ref={scrollContainerRef} className="flex-grow overflow-x-auto scroll-container">
                    <div ref={chartRef} className="h-full"></div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;