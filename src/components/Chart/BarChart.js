import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const Chart = styled.div`
  margin: 0 auto;

  h3 {
    margin: 0;
    text-align: center;
  }
`;

function BarChart(props) {

  const { xLabel, yLabel, title, width, height, data, onSelect } = props;
  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
  }, [width, height]);

  useEffect(() => {

    const draw = () => {
      // Ref: https://observablehq.com/@d3/bar-chart
      const svg = d3.select(ref.current);

      const color = 'steelblue';

      const margin = ({ top: yLabel === '' ? 20 : 40, right: 0, bottom: 50, left: 50 })

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

      const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

      const xAxis = g => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))
        .append('text')
        .attr('transform', `translate(${width / 2},${margin.bottom / 2})`)
        .attr('x', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('font-size', '1rem')
        .attr('fill', '#000')
        .text(xLabel)

      const yAxis = g => g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .call(g => g.select('.domain').remove())
        .call(g => g.append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(data.y))
        .append('text')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('font-size', '1rem')
        .attr('fill', '#000')
        .text(yLabel)

      svg.append('g')
        .attr('fill', color)
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', d => y(d.value))
        .attr('height', d => y(0) - y(d.value))
        .attr('width', x.bandwidth())
        .attr('value', d => d.value)
        .attr('name', d => d.name)
        .on('mouseover', (e) => d3.select(e.target).attr('opacity', 0.6).attr('cursor', 'pointer'))
        .on('mouseout', (e) => d3.select(e.target).attr('opacity', 1))
        .on('click', (d) => onSelect(d.target.getAttribute('name')))

      svg.append('g')
        .call(xAxis);

      svg.append('g')
        .call(yAxis);
    }

    if (data.length) draw();

  }, [xLabel, yLabel, width, height, data, onSelect]);

  return (
    <Chart style={{ width }}>
      <h3>{title}</h3>
      <svg ref={ref}></svg>
    </Chart>
  )
}

BarChart.defaultProps = {
  xLabel: '',
  yLabel: '',
  title: '',
  width: 600,
  height: 400,
  data: [],
  onSelect: () => { },
}

BarChart.propTypes = {
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.array,
  onSelect: PropTypes.func,
}

export default BarChart;
