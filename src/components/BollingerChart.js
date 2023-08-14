import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BollingerChart({ data, selectedColumns }) {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous chart

        const width = 600;
        const height = 600;
        const marginTop = 10;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;


        data.forEach(d => {
            const dateColumn = Object.keys(d).find(colName => colName.toLowerCase().includes('date'));
            // console.log(d[dateColumn])

            d[dateColumn] = new Date(d[dateColumn]);
            // console.log(d[dateColumn])
            selectedColumns.forEach(col => {
                // console.log("col = " + col)
                // console.log("datecol = " + dateColumn)
                if (col !== dateColumn) {
                    d[col] = +d[col];
                }
            });
        });

        // console.log(data)

        // const x = d3.scaleTime()
        //     .domain(d3.extent(data, d => d.DATE))
        //     .rangeRound([marginLeft, width - marginRight]);

        // const y = d3.scaleLinear()
        //     .domain(d3.extent(data, d => d.IPG2211A2N))
        //     .rangeRound([height - marginBottom - 20, marginTop]);


        // const line = d3.line()
        //     .x(d => x(d.DATE))
        //     .y(d => y(d.IPG2211A2N));
        let colname = Object.keys(data[0]).find(colName => colName.toLowerCase().includes('date'))
        // console.log(data[0][colname])

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d[Object.keys(d).find(colName => colName.toLowerCase().includes('date'))]))
            .rangeRound([marginLeft, width - marginRight]);

        const y = d3.scaleLog()
            .domain([d3.min(data, d => (d3.min(selectedColumns.map(col => {
                if (col !== colname) {
                    return +d[col]
                }
            })))), d3.max(data, d => (d3.max(selectedColumns.map(col => {
                if (col !== colname) {
                    return +d[col]
                }
            }))))])
            .rangeRound([height - marginBottom - 20, marginTop]);

        const line = d3.line()
            .x(d => x(d[Object.keys(d).find(colName => colName.toLowerCase().includes('date'))]))
            .y(d => y((d.value)));
        // .y(d => y(console.log(d[selectedColumns[0]])));

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .call(g => g.select(".domain").remove());

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickValues(d3.ticks(...y.domain(), 10)).tickFormat(d => d))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("↑ Value"));

        selectedColumns.forEach((col, index) => {
            svg.append('path')
                .datum(data.map(d => ({ Date: d[Object.keys(d).find(colName => colName.toLowerCase().includes('date'))], value: d[col] })))
                .attr('fill', 'none')
                .attr('stroke', d3.schemeCategory10[index])
                .attr('stroke-width', 2)
                .attr('d', line);
        });

    }, [data, selectedColumns]);

    return (
        <div>
            <h3>Bollinger Chart</h3>
            <svg ref={svgRef} width={600} height={600}></svg>
        </div>
    );
}

export default BollingerChart;
