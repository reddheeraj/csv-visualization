import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BubbleChart({ data, selectedColumns }) {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous chart

        const width = 600;
        const height = 400;
        const margin = { top: 50, right: 50, bottom: 40, left: 50 };

        // Filter out rows with undefined values in the selected columns
        const filteredData = data.filter(d => selectedColumns.every(col => d[col] !== undefined));
        // Create an extent for each selected column to define domains
        const extents = selectedColumns.map(col => d3.extent(filteredData, d => +d[col]))
            .filter(extent => extent[0] !== undefined && extent[1] !== undefined);
        console.log(extents);
        // Find the minimum and maximum values from all selected columns
        const xDomain = [Math.min(...extents.map(extent => extent[0])), Math.max(...extents.map(extent => extent[1]))];
        const yDomain = [Math.min(...extents.map(extent => extent[0])), Math.max(...extents.map(extent => extent[1]))];
        const radiusDomain = [Math.min(...extents.map(extent => extent[0])), Math.max(...extents.map(extent => extent[1]))];

        const xScale = d3.scaleLinear().domain(xDomain).nice().range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().domain(yDomain).nice().range([height - margin.bottom, margin.top]);
        const radiusScale = d3.scaleLinear().domain(radiusDomain).nice().range([5, 30]);

        svg.selectAll('circle')
            .data(filteredData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(+d[selectedColumns[0]]))
            .attr('cy', d => yScale(+d[selectedColumns[1]]))
            .attr('r', d => radiusScale(+d[selectedColumns[2]]))
            .attr('fill', 'steelblue')
            .attr('opacity', 0.7);

        // X Axis
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)') // Rotate the text by -45 degrees
            .style('text-anchor', 'end') // Right align text
        // .style('fill', 'black');

        // Y Axis
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale))
            .selectAll('text')
        // .style('fill', 'black');

    }, [data, selectedColumns]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '2rem',
            }}
        >
            <h3>Bubble Chart</h3>
            <svg ref={svgRef} width={600} height={400}></svg>
        </div>
    );
}

export default BubbleChart;
