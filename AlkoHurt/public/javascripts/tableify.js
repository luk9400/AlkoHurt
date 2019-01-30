// We assume that every object has the same keys
function objArrayToTable(objArray) {
  let table = document.createElement('table');
  table.className = 'table table-secondary';
  table.style.marginBottom = '0px';
  let thead = document.createElement('thead');
  let headersRow = document.createElement('tr');

  for (let key of Object.keys(objArray[0])) {
    let header = document.createElement('th');
    let headerText = key.toString();
    header.appendChild(document.createTextNode(headerText));
    headersRow.appendChild(header);
  }
  thead.appendChild(headersRow);
  table.appendChild(thead);

  for (let obj of objArray) {
    let row = document.createElement('tr');
    for (let key of Object.keys(obj)) {
      let data = document.createElement('td');
      let dataText = obj[key];
      data.appendChild(document.createTextNode(dataText));
      row.appendChild(data);
    }
    table.appendChild(row);
  }

  return table;
}