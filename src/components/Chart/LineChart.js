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

function LineChart(props) {

  const { title, width, height, data, onSelect } = props;
  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
  }, [width, height]);

  useEffect(() => {

    const draw = () => {
      // Ref: https://observablehq.com/@d3/inline-labels
      const svg = d3.select(ref.current);

      const margin = ({ top: 20, right: 50, bottom: 30, left: 30 });

      const x = d3.scaleUtc()
        .domain([data[0].date, data[data.length - 1].date])
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height - margin.bottom, margin.top]);

      const z = d3.scaleOrdinal(['key'], d3.schemeCategory10);

      const xAxis = g => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

      svg.append('g')
        .call(xAxis);

      const serie = svg.append('g')
        .selectAll('g')
        .data([data])
        .join('g');

      serie.append('path')
        .attr('fill', 'none')
        .attr('stroke', d => z(d[0].key))
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
          .x(d => x(d.date))
          .y(d => y(d.value))
        );

      serie.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(d => d)
        .join('text')
        .text(d => d.value)
        .attr('value', d => d.value)
        .attr('name', d => d.key)
        .on('mouseover', (e) => d3.select(e.target).attr('opacity', 0.6).attr('cursor', 'pointer'))
        .on('mouseout', (e) => d3.select(e.target).attr('opacity', 1))
        .on('click', (d) => onSelect(d.target.getAttribute('name')))
        .attr('dy', '0.35em')
        .attr('x', d => x(d.date))
        .attr('y', d => y(d.value))
        .clone(true).lower()
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 6)

    }

    if (data.length) draw();

  }, [width, height, data, onSelect]);

  return (
    <Chart style={{ width }}>
      <h3>{title}</h3>
      <svg ref={ref}></svg>
    </Chart>
  )
}

LineChart.defaultProps = {
  xLabel: '',
  yLabel: '',
  title: '',
  width: 600,
  height: 400,
  data: [],
  onSelect: () => { },
}

LineChart.propTypes = {
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.array,
  onSelect: PropTypes.func,
}

export default LineChart;
