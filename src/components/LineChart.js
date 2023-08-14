import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function LineChart({ data, selectedColumns }) {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous chart

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 50, bottom: 40, left: 50 };

        const xDomain = d3.extent(data, (_, i) => i);
        const yMax = d3.max(data, d => d3.max(selectedColumns.map(col => +d[col])));
        const yDomain = [0, yMax];

        const xScale = d3.scaleLinear().domain(xDomain).nice().range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().domain(yDomain).nice().range([height - margin.bottom, margin.top]);

        const lineGenerator = d3.line()
            .x((_, i) => xScale(i))
            .y(d => yScale(d));

        svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);


        selectedColumns.forEach((col, index) => {
            svg.append('path')
                .datum(data.map(d => +d[col])) // Convert data to numbers
                .attr('fill', 'none')
                .attr('stroke', d3.schemeCategory10[index]) // Use different colors
                .attr('stroke-width', 2)
                .attr('d', lineGenerator);
        });

        // X Axis
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('fill', 'black')

        // X Axis label
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 5)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('fill', 'black')
            .text('Index');

        // Y Axis
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll('text')
            .style('fill', 'black'); // Use a reasonable number of ticks

        // Y Axis label
        svg.selectAll('.y-label')
            .data(selectedColumns)
            .enter()
            .append('text')
            .attr('class', 'y-label')
            .attr('x', -height / 2)
            .attr('dy', '-1.5em')
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .style('fill', 'black')
            .text(selectedColumns.join(', '));

    }, [data, selectedColumns]);

    return (
        <div>
            <h3>Line Chart</h3>
            <svg ref={svgRef} width={600} height={400}></svg>
        </div>
    );
}

export default LineChart;
