import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Table = styled.div`
  table {
    margin: 0 auto;
    border-collapse: collapse;
    text-align: center;

    tr.mark {
      color: #fff;
      background: #d91406;
    }

    thead {
      border-bottom: 1px solid #000;
      text-transform: uppercase;
    }

    td,
    th {
      padding: .5rem;
    }
  }
`;

function DataTable(props) {
  const renderHeader = (row) => {
    return (
      <tr>
        {Object.keys(row).map((k, i) => <th key={`head-${i}`}>{k}</th>)}
      </tr>
    )
  }

  const renderRow = (row, i) => {
    const className = (props.mark === row['key']) || (props.mark === row['name']) ? 'mark' : '';
    return (
      <tr key={`row-${i}`} className={className}>
        {Object.keys(row).map((k, i) => <td key={`row-${i}`}>{String(row[k])}</td>)}
      </tr>
    )
  }

  const renderTable = (data = []) => {
    return data.length > 0 ?
      (
        <table>
          <thead>{renderHeader(data[0])}</thead>
          <tbody>{data.map(renderRow.bind(this))}</tbody>
        </table>
      ) : null
  }

  return (
    <Table>
      {renderTable(props.data)}
    </Table>
  )
}

DataTable.defaultProps = {
  data: [],
  mark: '',
}

DataTable.propTypes = {
  data: PropTypes.array,
  mark: PropTypes.string,
}

export default DataTable;
