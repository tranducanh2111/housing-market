import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import './LineChart.css';

const LineChart = ({ livingAreaData, landAreaData, predictionResult }) => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [areaType, setAreaType] = useState('living_area');

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    const drawLineChart = useCallback((livingAreaPrice, landAreaPrice) => {
        const containerWidth = dimensions.width;
        const containerHeight = dimensions.height;

        const marginTop = 20;
        const marginRight = 50;
        const marginBottom = 30;
        const marginLeft = 65;

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
            .select('.domain')
            .remove();

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

        // Add X-axis label using foreignObject
        // svg.append('foreignObject')
        //     .attr('x', containerWidth / 2 - 100)
        //     .attr('y', containerHeight +10)
        //     .attr('width', 200)
        //     .attr('height', 30)
        //     .append('xhtml:div')
        //     .style('text-align', 'center')
        //     .style('font-size', '1rem')
        //     .text('Living/Land Area (m²)');

        // Add Y-axis label using foreignObject
        // svg.append('foreignObject')
        //     .attr('x', -containerHeight / 2 - 10)
        //     .attr('y', 0)
        //     .attr('width', containerHeight)
        //     .attr('height', 30)
        //     .append('xhtml:div')
        //     .style('text-align', 'center')
        //     .style('font-size', '1rem')
        //     .style('transform', 'rotate(-90deg)')
        //     .style('transform-origin', 'center')
        //     .text('Price (USD)');

        // Remove any existing tooltips first
        d3.select(containerRef.current).selectAll('#tooltip').remove();

        // Create new tooltip
        const tooltip = d3.select(containerRef.current)
            .append('div')
            .attr('id', 'tooltip')
            .style('visibility', 'hidden');

        // Create graph
        update(areaType, 0);
        update(areaType, 0); // this has to be called twice for the tooltip to work ¯\_(ツ)_/¯

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
                .attr('y1', containerHeight - 30)
                .attr('x2', d => xAxisScaler(d))
                .attr('y2', 20)
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
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 2.5)

            // Update dots
            const dots = svg.selectAll('.line-chart-dot').data(data);
            dots.enter()
                .append('circle')
                .attr('class', 'line-chart-dot')
                .attr('fill', 'steelblue')
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
                .attr('fill', 'steelblue')
                .style('opacity', 0)
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
                tooltip.style('top', event.pageY - 20 + 'px')
                    .style('left', event.pageX + 20 + 'px');
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
                    .attr('r', 12)
                    .attr('fill', 'red')
                    .attr('opacity', 0)
                    .transition()
                    .duration(t)
                    .attr('opacity', 1)
                    .attr('cx', d => xAxisScaler(d.area))
                    .attr('cy', d => yAxisScaler(d.price));

                // Add hover functionality for prediction dot
                svg.selectAll('.prediction-hover-dot')
                    .data([predictionPoint])
                    .join('circle')
                    .attr('class', 'prediction-hover-dot')
                    .attr('r', 20)
                    .attr('fill', 'yellow')
                    .style('opacity', 0)
                    .attr('cx', d => xAxisScaler(d.area))
                    .attr('cy', d => yAxisScaler(d.price))
                    .on('mouseover', (event, d) => {
                        d3.select(event.target).style('opacity', 0.3);
                        tooltip.style('visibility', 'visible')
                            .text(`Predicted Property\n${areaType === 'living_area' ? 'Living' : 'Land'} area: ${d.area.toFixed(2)} m²\nPrice: ${d3.format(",.2f")(d.price)} USD`);
                    })
                    .on('mousemove', (event) => {
                        tooltip.style('top', event.pageY - 20 + 'px')
                            .style('left', event.pageX + 20 + 'px');
                    })
                    .on('mouseout', (event) => {
                        d3.select(event.target).style('opacity', 0);
                        tooltip.style('visibility', 'hidden');
                    });
            }
        }
    }, [dimensions, areaType, predictionResult]);

    function calculateAxisDomain(lowerBound, upperBound, paddingPercent)
    {
        const padding = (upperBound - lowerBound) / paddingPercent;
        const lb = lowerBound - padding;
        const ub = upperBound + padding;

        return [lb, ub];
    }

    useEffect(() => {
        if (livingAreaData && landAreaData) {
            drawLineChart(livingAreaData, landAreaData);
        }
        
        // Cleanup function
        return () => {
            // Remove all tooltips when component unmounts
            d3.select(containerRef.current).selectAll('#tooltip').remove();
            d3.selectAll('.bar-chart-tooltip').remove();
            // Also remove any orphaned tooltips from the body
            d3.select('body').selectAll('#tooltip').remove();
        };
    }, [drawLineChart, livingAreaData, landAreaData]);

    const handleAreaChange = (event) => {
        setAreaType(event.target.value);
    };

    return (
        <div ref={containerRef} className="w-full h-full">
            <form>
                <label>
                    <input
                        type="radio"
                        name="area"
                        value="living_area"
                        checked={areaType === 'living_area'}
                        onChange={handleAreaChange}
                        className='mr-2'
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
                        className='mr-2'
                    />
                    Land Area
                </label>
            </form>
            <div ref={chartRef} className="w-full h-full"></div>
        </div>
    );
};

export default LineChart;