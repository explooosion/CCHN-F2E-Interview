import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { BarChart, LineChart, PieChart } from '../components/Chart'

import DataTable from '../container/Home/DataTable';

const Main = styled.main`
  position: relative;
  padding: 2rem;

  > div:first-child {
    margin-bottom: 1rem;
  }
`;

const Ctrl = styled.div`
  margin-bottom: auto;
  text-align: center;

  label {
    margin-right: 1rem;
  }
`;

function Home() {

  const selCharts = [
    { name: '每年所有電動車車型數量', value: 1 },
    { name: '各車廠電機車數量佔比', value: 2 },
    { name: '電動車Size的平均電動車馬力(KW)', value: 3 },
  ]

  const { datas } = useSelector(state => state.cars);

  const [active, setActive] = useState(1);
  const [mark, setMark] = useState(null);

  let data = [];

  // 按年份，所有電動車的車型數量圖示
  const fetchData1 = (data = []) => {
    return _.chain(data)
      .groupBy('YEAR')
      .map((group, key) => ({ key: key, date: new Date(key), value: _.sumBy(group, '(kW)') }))
      .sortBy('date')
      .value();
  }

  // 各車廠推出的電機車數量佔比圖示
  const fetchData2 = (data = []) => {
    return _.chain(data)
      .groupBy('Make')
      .map((group, key) => ({ name: key, value: group.length }))
      .reduce((acc, { name, value }, index, total) => ([
        ...acc,
        {
          name,
          value: _.round(_.floor(value / (_.sumBy(total, 'value')), 3) * 100, 2),
        }
      ]), [])
      .value()
  }

  // 電動車Size的平均電動車馬力(KW)圖示(依照KW由小到大排序)
  const fetchData3 = (data = []) => {
    return _.chain(data)
      .groupBy('Size')
      .map((group, key) => ({ name: key, value: _.round(_.meanBy(group, '(kW)'), 2) }))
      .sortBy('value')
      .value()
  }

  const onChange = (e) => setActive(Number(e.target.value));

  const onSelect = (target) => {
    console.log(target);
    setMark(target);
  }

  const renderOptions = () => {
    return selCharts.map(({ name, value }, index) => <option key={`opt-${index}`} value={value}>{index + 1}. {name}</option>)
  }

  const switchChart = (data = []) => {
    const { name } = _.find(selCharts, ({ value }) => value === active);
    switch (active) {
      default:
      case 1: return <LineChart width={400} height={300} data={data} title={name} onSelect={onSelect} />
      case 2: return <PieChart width={400} height={300} data={data} title={name} onSelect={onSelect} />
      case 3: return <BarChart width={800} height={300} data={data} title={name} xLabel={'Size'} yLabel={'(kW)'} onSelect={onSelect} />
    }
  }

  switch (active) {
    default:
    case 1: data = fetchData1(datas); break;
    case 2: data = fetchData2(datas); break;
    case 3: data = fetchData3(datas); break;
  }

  return (
    <Main>
      <Ctrl>
        <label>請選擇圖表</label>
        <select onChange={onChange.bind(this)}>{renderOptions()}</select>
      </Ctrl>
      {switchChart(data)}
      <DataTable data={data} mark={mark} />
    </Main>
  )
}

export default Home;
