export function csvToArray(datas = '') {
  return String(datas)
    .split(/\r\n/)
    .filter(row => row.length)
    .reduce((prev, current, index) => {
      if (index === 0) {
        prev.header = current.split(',');
        prev.headerObj = prev.header.reduce((prev, current) => ({ ...prev, [current]: current }), {});
      } else {
        const payload = current
          .split(',')
          .reduce((row, column, index) => ({ ...row, [prev.header[index]]: Number.isNaN(Number(column)) ? column : Number(column) }), {});
        prev.datas.push(payload);
      }
      return prev;
    }, { header: [], headerObj: {}, datas: [] });
}
