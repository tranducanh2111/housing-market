import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

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
const BarChart = ({ data, selectedCity }) => {
    // Refs for DOM elements
    const yAxisRef = useRef(null);          // Reference for fixed y-axis container
    const chartRef = useRef(null);          // Reference for main chart container
    const containerRef = useRef(null);       // Reference for outer container
    const scrollContainerRef = useRef(null); // Reference for scrollable area
    
    // State management
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [sortOrder, setSortOrder] = useState('Alphabetical');

    // Constants
    const TRANSITION_DURATION = 750; // Duration for animations in milliseconds

    /**
     * Formats price numbers with thousands separators
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    /**
     * Sets up ResizeObserver to handle responsive behavior
     */
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

    /**
     * Helper function to check if an element is in the viewport
     */
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    /**
     * Handles scrolling to selected city after transitions
     */
    useEffect(() => {
        if (selectedCity && scrollContainerRef.current) {
            setTimeout(() => {
                const selectedBar = Array.from(document.querySelectorAll('.bar')).find(bar => 
                    bar.getAttribute('data-city').toLowerCase() === selectedCity.toLowerCase()
                );
                
                // Only scroll if both the bar and container are found and container is in viewport
                if (selectedBar && scrollContainerRef.current && isElementInViewport(scrollContainerRef.current)) {
                    selectedBar.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                }
            }, TRANSITION_DURATION);
        }
    }, [selectedCity, sortOrder, data]);

    /**
     * Main chart drawing function
     * Handles creation and updates of all D3 elements including:
     * - Scales and axes
     * - Grid lines
     * - Bars and transitions
     * - Tooltips and interactions
     */
    const drawBarChart = useCallback((data) => {
        if (!data || !dimensions.height) return;
        
        // Chart dimensions and layout parameters
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 80;
        const marginLeft = 80;

        const barWidth = 20;
        const barGap = 4;
        const barStep = barWidth + barGap;

        const containerHeight = dimensions.height;
        const totalWidth = marginLeft + (data.length * barStep) + marginRight;

        // Sorting functions map
        const orderMap = new Map([
            ['Alphabetical', (a, b) => d3.ascending(a.city, b.city)],
            ['Ascending', (a, b) => d3.ascending(a.price, b.price)],
            ['Descending', (a, b) => d3.descending(a.price, b.price)],
        ]);

        const sortedData = [...data].sort(orderMap.get(sortOrder));

        // Scale setup
        const maxPrice = d3.max(sortedData, d => d.price) || 0;
        const minPrice = d3.min(sortedData, d => d.price) || 0;
        const yDomain = [minPrice * 1.2, maxPrice * 1.2]; // Add 20% padding to top of scale

        const x = d3.scaleBand()
            .domain(sortedData.map(d => d.city))
            .range([0, totalWidth - marginLeft - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain(yDomain)
            .range([containerHeight - marginBottom, marginTop]);

        // Y-Axis setup and styling
        let yAxisSvg = d3.select(yAxisRef.current).select('svg');
        
        if (yAxisSvg.empty()) {
            yAxisSvg = d3.select(yAxisRef.current)
                .append('svg')
                .attr('width', marginLeft)
                .attr('height', containerHeight)
                .attr('class', 'y-axis-svg');

            yAxisSvg.append('g').attr('class', 'y-axis');
            yAxisSvg.append('g').attr('class', 'grid');
        }

        // Update y-axis with transitions
        const yAxis = yAxisSvg.select('.y-axis')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .transition()
            .duration(TRANSITION_DURATION)
            .call(d3.axisLeft(y)
                .tickFormat(d3.format(',d'))
                .ticks(5)
            );

        // Style axis elements
        yAxis.select('.domain')
            .style('stroke', '#333')
            .style('stroke-width', '2px')
            .attr('d', `M0,${marginTop}V${containerHeight - marginBottom}`);

        yAxis.selectAll('text')
            .style('font-size', '12px')
            .style('fill', '#333')
            .style('font-weight', '400');
        yAxis.selectAll('line')
            .style('stroke', '#333');

        // Grid lines setup
        const yGrid = yAxisSvg.select('.grid')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(y)
                .tickSize(-marginLeft)
                .tickFormat('')
                .ticks(5)
            );

        yGrid.selectAll('line')
            .style('stroke', '#e0e0e0')
            .style('stroke-dasharray', '2,2');
        yGrid.select('.domain').remove();

        // Main chart SVG setup
        let mainSvg = d3.select(chartRef.current).select('svg');
        
        if (mainSvg.empty()) {
            mainSvg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', totalWidth - marginLeft)
                .attr('height', containerHeight)
                .attr('class', 'main-svg');

            mainSvg.append('g').attr('class', 'x-axis');
            mainSvg.append('g').attr('class', 'horizontal-grid');
            mainSvg.append('g').attr('class', 'bars');
        } else {
            mainSvg
                .attr('width', totalWidth - marginLeft)
                .attr('height', containerHeight);
        }

        // Horizontal grid setup
        const horizontalGrid = mainSvg.select('.horizontal-grid')
            .attr('transform', `translate(0, 0)`)
            .call(d3.axisLeft(y)
                .tickSize(-(totalWidth - marginLeft - marginRight))
                .tickFormat('')
                .ticks(5)
            );

        horizontalGrid.selectAll('line')
            .style('stroke', '#e0e0e0')
            .style('stroke-dasharray', '2,2');
        horizontalGrid.select('.domain').remove();

        // X-axis setup and styling
        const xAxis = mainSvg.select('.x-axis')
            .attr('transform', `translate(0,${containerHeight - marginBottom})`);

        xAxis.transition()
            .duration(TRANSITION_DURATION)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Style x-axis elements
        xAxis.select('.domain')
            .style('stroke', '#333');
        xAxis.selectAll('text')
            .style('font-size', '12px')
            .style('fill', '#333')
            .style('font-weight', '400')
            .attr('transform', 'rotate(45)')
            .attr('text-anchor', 'start')
            .attr('dx', '0.5em')
            .attr('dy', '0.5em');
        xAxis.selectAll('line')
            .style('stroke', '#333');

        // Tooltip setup
        let tooltip = d3.select(containerRef.current).select('.bar-chart-tooltip');
        if (tooltip.empty()) {
            tooltip = d3.select(containerRef.current)
                .append('div')
                .attr('class', 'bar-chart-tooltip')
                .style('position', 'absolute')
                .style('visibility', 'hidden')
                .style('background-color', 'white')
                .style('border', '1px solid #ddd')
                .style('padding', '10px')
                .style('border-radius', '4px')
                .style('pointer-events', 'none')
                .style('z-index', '1000')
                .style('font-size', '14px');
        }

        // Bar color helper
        const getBarColor = (d) => d.city.toLowerCase() === selectedCity.toLowerCase() ? 'red' : '#0E4459';

        // Bar chart update pattern (enter/update/exit)
        const bars = mainSvg.select('.bars').selectAll('.bar')
            .data(sortedData, d => d.city);

        // Remove old bars with transition
        bars.exit()
            .transition()
            .duration(TRANSITION_DURATION)
            .attr('y', containerHeight - marginBottom)
            .attr('height', 0)
            .remove();

        // Update existing bars
        bars.transition()
            .duration(TRANSITION_DURATION)
            .attr('fill', getBarColor)
            .attr('data-city', d => d.city)
            .attr('x', d => x(d.city))
            .attr('y', d => y(d.price))
            .attr('width', x.bandwidth())
            .attr('height', d => containerHeight - marginBottom - y(d.price));

        // Add new bars with hover interactions
        bars.enter()
            .append('rect')
            .attr('class', 'bar cursor-pointer')
            .attr('data-city', d => d.city)
            .attr('fill', getBarColor)
            .attr('x', d => x(d.city))
            .attr('width', x.bandwidth())
            .attr('y', containerHeight - marginBottom)
            .attr('height', 0)
            .on('mouseover', (event, d) => {
                tooltip
                    .style('visibility', 'visible')
                    .html(`City: ${d.city}<br/>Price: $${formatPrice(d.price)}`);
                
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('fill', 'yellow');
            })
            .on('mousemove', (event) => {
                const tooltipNode = tooltip.node();
                const tooltipWidth = tooltipNode.offsetWidth;
                const windowWidth = window.innerWidth;
                const mouseX = event.pageX;
                
                const wouldOverflowRight = mouseX + tooltipWidth + 20 > windowWidth;
                
                tooltip
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', wouldOverflowRight 
                        ? (mouseX - tooltipWidth - 10) + 'px'
                        : (mouseX + 10) + 'px');
            })
            .on('mouseout', (event, d) => {
                tooltip.style('visibility', 'hidden');
                
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('fill', getBarColor(d));
            })
            .transition()
            .duration(TRANSITION_DURATION)
            .attr('y', d => y(d.price))
            .attr('height', d => containerHeight - marginBottom - y(d.price));

        // Update all existing bars with hover effects
        mainSvg.selectAll('.bar')
            .on('mouseover', (event, d) => {
                tooltip
                    .style('visibility', 'visible')
                    .html(`City: ${d.city}<br/>Price: $${formatPrice(d.price)}`);
                
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('fill', 'yellow');
            })
            .on('mousemove', (event) => {
                const tooltipNode = tooltip.node();
                const tooltipWidth = tooltipNode.offsetWidth;
                const windowWidth = window.innerWidth;
                const mouseX = event.pageX;
                
                const wouldOverflowRight = mouseX + tooltipWidth + 20 > windowWidth;
                
                tooltip
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', wouldOverflowRight 
                        ? (mouseX - tooltipWidth - 10) + 'px'
                        : (mouseX + 10) + 'px');
            })
            .on('mouseout', (event, d) => {
                tooltip.style('visibility', 'hidden');
                
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('fill', getBarColor(d));
            });

    }, [dimensions, sortOrder, selectedCity]);

    /**
     * Trigger chart redraw when data or dimensions change
     */
    useEffect(() => {
        if (data && dimensions.height > 0) {
            drawBarChart(data);
        }
    }, [data, drawBarChart, dimensions]);

    /**
     * Handle sort order changes
     */
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    useEffect(() => {
        // Cleanup function
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
                    value={sortOrder} 
                    onChange={handleSortChange} 
                    className="border rounded p-1 text-body-sm sm:text-body"
                >
                    <option value="Alphabetical">Alphabetical</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                </select>
            </form>
            <div className="flex">
                <div 
                    ref={yAxisRef}
                    className="y-axis-container sticky left-0 z-10 bg-white"
                ></div>
                <div 
                    ref={scrollContainerRef} 
                    className="overflow-x-auto flex-grow relative"
                >
                    <div 
                        ref={chartRef}
                        className="chart-container min-w-full h-full"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;