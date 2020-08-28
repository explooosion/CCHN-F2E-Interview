import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const Chart = styled.div`
  margin: 0 auto;

  h3 {
    margin: 0 0 1rem;
    text-align: center;
  }
`;

function PieChart(props) {

  const { title, width, height, data, onSelect } = props;
  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
  }, [width, height]);

  useEffect(() => {

    const draw = () => {
      // Ref: https://observablehq.com/@d3/pie-chart
      const svg = d3.select(ref.current);

      const pie = d3.pie().sort(null).value(d => d.value)

      // overwrite height
      let height = Math.min(width, 500)

      const radius = Math.min(width, height) / 2 * 0.8;
      const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1)

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

      const arcs = pie(data);

      svg.attr('viewBox', [-width / 2, -height / 2, width, height]);

      svg.append('g')
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', d => color(d.data.name))
        .attr('value', d => d.data.value)
        .attr('name', d => d.data.name)
        .on('mouseover', (e) => d3.select(e.target).attr('opacity', 0.6).attr('cursor', 'pointer'))
        .on('mouseout', (e) => d3.select(e.target).attr('opacity', 1))
        .on('click', (d) => onSelect(d.target.getAttribute('name')))
        .attr('d', arc)
        .append('title')
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}%`)

      svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .text(d => d.data.name)
        )
        .call(text => text
          // .filter(d => (d.endAngle - d.startAngle) > 0.25)
          .append('tspan')
          .attr('x', '5px')
          .attr('y', '0.7em')
          .attr('fill-opacity', 0.8)
          .attr('text-align', 'center')
          .text(d => `${d.data.value.toLocaleString()}%`)
        )

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

PieChart.defaultProps = {
  xLabel: '',
  yLabel: '',
  title: '',
  width: 600,
  height: 400,
  data: [],
  onSelect: () => { },
}

PieChart.propTypes = {
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.array,
  onSelect: PropTypes.func,
}

export default PieChart;
