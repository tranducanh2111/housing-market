import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, selectedCity }) => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [sortOrder, setSortOrder] = useState('Alphabetical');

    const FIXED_Y_MAX = 1000000;
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

        // Get or create SVG
        let svg = d3.select(chartRef.current).select('svg');
        
        if (svg.empty()) {
            // First time creation
            svg = d3.select(chartRef.current)
                .append('svg')
                .attr('id', 'bar-chart-svg')
                .attr('width', totalWidth)
                .attr('height', containerHeight)
                // .attr('viewBox', `0 0 ${totalWidth} ${containerHeight}`)
                .attr('preserveAspectRatio', 'xMinYMid');

            // Add groups for axes and grid
            svg.append('g').attr('class', 'grid');
            svg.append('g').attr('class', 'y-axis');
            svg.append('g').attr('class', 'x-axis');
        }

        // Create scales
        const x = d3.scaleBand()
            .domain(sortedData.map(d => d.city))
            .range([marginLeft, totalWidth - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, FIXED_Y_MAX])
            .range([containerHeight - marginBottom, marginTop]);

        // Update grid
        const grid = svg.select('.grid')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(y)
                .tickSize(-totalWidth + marginLeft + marginRight)
                .tickFormat('')
            );

        // Style the grid
        grid.selectAll('line')
            .style('stroke-dasharray', '2,2')
            .style('stroke-opacity', '0.1');

        // Remove the domain line (the thick line at the top)
        grid.select('.domain').remove();

        // Update y-axis
        const yAxis = svg.select('.y-axis')
            .attr('transform', `translate(${marginLeft}, 0)`)
            .transition()
            .duration(TRANSITION_DURATION)
            .call(d3.axisLeft(y)
                .tickFormat(d3.format(',d'))
                .ticks(5)
            );

        // Remove the domain line from y-axis as well
        yAxis.select('.domain').style('stroke', '#333');

        // Style y-axis ticks
        yAxis.selectAll('text')
            .style('font-size', '12px')
            .style('fill', '#333')
            .style('font-weight', '400');

        yAxis.selectAll('line')
            .style('stroke', '#333');

        // Update x-axis with transition
        const xAxis = svg.select('.x-axis')
            .attr('transform', `translate(0,${containerHeight - marginBottom})`);

        xAxis.transition()
            .duration(TRANSITION_DURATION)
            .call(d3.axisBottom(x));

        // Style x-axis line and ticks
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

        // Update bars with transition
        const bars = svg.selectAll('.bar')
            .data(sortedData, d => d.city);

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
            .attr('fill', d => d.city.toLowerCase() === selectedCity.toLowerCase() ? 'red' : 'steelblue')
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
            .attr('fill', d => d.city.toLowerCase() === selectedCity.toLowerCase() ? 'red' : 'steelblue')
            .attr('x', d => x(d.city))
            .attr('width', x.bandwidth())
            .attr('y', containerHeight - marginBottom)
            .attr('height', 0)
            .on('mouseover', (event, d) => {
                tooltip
                    .style('visibility', 'visible')
                    .html(`City: ${d.city}<br/>Price: $${formatPrice(d.price)}`);
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.style('visibility', 'hidden');
            })
            .transition()
            .duration(TRANSITION_DURATION)
            .attr('y', d => y(d.price))
            .attr('height', d => containerHeight - marginBottom - y(d.price));

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
            <div ref={scrollContainerRef} className="chart-scroll-container overflow-x-auto">
                <div 
                    ref={chartRef} 
                    className="chart-container"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default BarChart;