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
        const containerHeight = dimensions.height - 24;

        const marginTop = 40;
        const marginRight = 20;
        const marginBottom = 80;
        const marginLeft = 50;

        // hash map containing the sorting functions for the chart's order
        const orderMap = new Map([
            ['Alphabetical', (a, b) => d3.ascending(a['city'], b['city'])],
            ['Ascending', (a, b) => d3.ascending(a['price'], b['price'])],
            ['Descending', (a, b) => d3.descending(a['price'], b['price'])]
        ]);

        // Sort data according to current order
        data.sort(orderMap.get(currentOrder));

        // x-axis scaler
        const xAxisScaler = getXaxisScaler(containerWidth, marginLeft, marginRight);
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
            .attr('class', 'y-axis-svg')
            .style('z-index', '20');

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
            .attr('y', 12)
            .style('text-anchor', 'start')
            .style('text-color', '#0E4459')
            .text('↑ Price (USD)');

        // Add domain line
        const maxPrice = d3.max(data, d => d['price']);

        // Add vertical domain line
        yAxisSvg.append('line')
            .attr('x1', marginLeft) // Align with the y-axis
            .attr('y1', marginTop - 10) // Start at the top margin
            .attr('x2', marginLeft) // Vertical line, so x1 = x2
            .attr('y2', containerHeight - marginBottom) // End at the bottom margin
            .attr('stroke', 'black') // Line color
            .attr('stroke-width', 1) // Line width
            .attr('class', 'vertical-domain-line'); // Optional class for styling

        // Create main chart SVG
        const mainSvg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', rangeLeft + 30)
            .attr('height', containerHeight)
            .attr('class', 'main-svg')
            .style('z-index', '10');

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
            .attr('y', containerHeight - marginBottom) // Start from the bottom
            .attr('width', xAxisScaler.bandwidth())
            .attr('height', 0); // Start with height 0

        // Create the tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('visibility', 'hidden')
            .style('position', 'absolute')
            .style('background', 'rgba(69,77,93,.9)')
            .style('border-radius', '.5rem')
            .style('color', '#fff')
            .style('box-shadow', '0 0 5px #999999')
            .style('font-size', '14px')
            .style('padding', '.2rem .4rem')
            .style('z-index', '9999');

        // Attach event listeners to bars
        bars.on('mouseover', function(event, d) {
            tooltip.style('visibility', 'visible')
                .text(`City: ${d['city']}\nPrice: ${formatPrice(d['price'])} USD`);
        });

        bars.on('mousemove', function(event) {
            tooltip.style('top', (event.pageY - 20) + 'px')
                .style('left', (event.pageX + 20) + 'px');
        });

        bars.on('mouseout', function() {
            tooltip.style('visibility', 'hidden');
        });

        // Apply transitions separately
        bars.transition()
            .duration(750)
            .attr('y', d => yAxisScaler(d['price']))
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
            .attr('dy', '0.5em')
            .style('font-size', '10.5px')
            .style('opacity', 0) // Start with opacity 0
            .transition() // Add transition
            .duration(750)
            .style('opacity', 1); // Fade in text

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

    function getXaxisScaler(containerWidth, marginLeft, marginRight) {
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
                    className="w-fit bg-primary text-white text-footnote-sm sm:text-footnote flex items-center justify-center px-3 py-[8px] h-[36px] rounded-md transition duration-300 ease-in-out"
                >
                    Go to selected city
                </button>
            </form>
            <div className="flex">
                <div ref={yAxisRef} className="sticky left-0" style={{ zIndex: 20 }}></div>
                <div ref={scrollContainerRef} className="flex-grow overflow-x-hidden scroll-container" style={{ zIndex: 10 }}>
                    <div ref={chartRef} className="h-full"></div>
                </div>
            </div>
            <p className='text-center text-[14px] font-bold text-primary -mt-[32px] sm:-mt-[12px]'>City</p>
        </div>
    );
};

export default BarChart;