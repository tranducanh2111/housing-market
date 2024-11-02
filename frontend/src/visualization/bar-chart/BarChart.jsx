import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, selectedCity }) => {
    const yAxisRef = useRef(null);
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [sortOrder, setSortOrder] = useState('Alphabetical');

    const TRANSITION_DURATION = 750;

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
        if (selectedCity && scrollContainerRef.current) {
            setTimeout(() => {
                const selectedBar = Array.from(document.querySelectorAll('.bar')).find(bar => 
                    bar.getAttribute('data-city').toLowerCase() === selectedCity.toLowerCase()
                );
                if (selectedBar) {
                    selectedBar.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                }
            }, TRANSITION_DURATION + 100);
        }
    }, [selectedCity, sortOrder, data]);

    const drawBarChart = useCallback((data) => {
        if (!data || !dimensions.height) return;
        
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 80;
        const marginLeft = 80;

        const barWidth = 20;
        const barGap = 4;
        const barStep = barWidth + barGap;

        const containerHeight = dimensions.height;
        const totalWidth = marginLeft + (data.length * barStep) + marginRight;

        const orderMap = new Map([
            ['Alphabetical', (a, b) => d3.ascending(a.city, b.city)],
            ['Ascending', (a, b) => d3.ascending(a.price, b.price)],
            ['Descending', (a, b) => d3.descending(a.price, b.price)],
        ]);

        const sortedData = [...data].sort(orderMap.get(sortOrder));

                .attr('width', totalWidth)
        // Calculate max and min values for y-axis
        const maxPrice = d3.max(sortedData, d => d.price) || 0;
        const minPrice = d3.min(sortedData, d => d.price) || 0;
        const yDomain = [minPrice, maxPrice * 1.2];

        // Create scales
        const x = d3.scaleBand()
            .domain(sortedData.map(d => d.city))
            .range([0, totalWidth - marginLeft - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain(yDomain)
            .range([containerHeight - marginBottom, marginTop]);

        // Handle Y-Axis (Fixed)
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

        // Update y-axis
        const yAxis = yAxisSvg.select('.y-axis')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .transition()
            .duration(TRANSITION_DURATION)
            .call(d3.axisLeft(y)
                .tickFormat(d3.format(',d'))
                .ticks(5)
            );

        // Style y-axis and draw domain line
        yAxis.select('.domain')
            .style('stroke', '#333')
            .style('stroke-width', '2px') // Make domain line more visible
            .attr('d', `M0,${marginTop}V${containerHeight - marginBottom}`); // Draw vertical line from top to bottom

        yAxis.selectAll('text')
            .style('font-size', '12px')
            .style('fill', '#333')
            .style('font-weight', '400');
        yAxis.selectAll('line')
            .style('stroke', '#333');

        // Update grid lines in fixed y-axis container
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

        // Handle Scrollable Content (X-axis and Bars)
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

        // Update horizontal grid lines in main chart
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

        // Update x-axis
        const xAxis = mainSvg.select('.x-axis')
            .attr('transform', `translate(0,${containerHeight - marginBottom})`);

        xAxis.transition()
            .duration(TRANSITION_DURATION)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Style x-axis
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

        // Handle tooltip
        let tooltip = d3.select('body').select('.bar-chart-tooltip');
        if (tooltip.empty()) {
            tooltip = d3.select('body')
                .append('div')
                .attr('class', 'bar-chart-tooltip')
                .style('position', 'absolute')
                .style('visibility', 'hidden')
                .style('background-color', 'white')
                .style('border', '1px solid #ddd')
                .style('padding', '10px')
                .style('border-radius', '4px')
                .style('pointer-events', 'none')
                .style('z-index', '1000');
        }

        // Update bars (now on top of grid)
        const bars = mainSvg.select('.bars').selectAll('.bar')
            .data(sortedData, d => d.city);

        // Helper function to determine bar color
        const getBarColor = (d) => d.city.toLowerCase() === selectedCity.toLowerCase() ? 'red' : 'steelblue';

        // Remove old bars
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

        // Add new bars
        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('data-city', d => d.city)
            .attr('fill', getBarColor)
            .attr('x', d => x(d.city))
            .attr('width', x.bandwidth())
            .attr('y', containerHeight - marginBottom)
            .attr('height', 0)
            .on('mouseover', (event, d) => {
                // Show tooltip
                tooltip
                    .style('visibility', 'visible')
                    .html(`City: ${d.city}<br/>Price: $${formatPrice(d.price)}`);
                
                // Change bar color to yellow on hover
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('fill', 'yellow');
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', (event, d) => {
                // Hide tooltip
                tooltip.style('visibility', 'hidden');
                
                // Return to original color based on selection state
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
                tooltip
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', (event, d) => {
                tooltip.style('visibility', 'hidden');
                
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('fill', getBarColor(d));
            });

    }, [dimensions, sortOrder, selectedCity]);

    useEffect(() => {
        if (data && dimensions.height > 0) {
            drawBarChart(data);
        }
    }, [data, drawBarChart, dimensions]);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

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
                    className="y-axis-container"
                    style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                        backgroundColor: 'white'
                    }}
                ></div>
                <div 
                    ref={scrollContainerRef} 
                    className="overflow-x-auto flex-grow"
                    style={{
                        position: 'relative'
                    }}
                >
                    <div 
                        ref={chartRef}
                        className="chart-container"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;