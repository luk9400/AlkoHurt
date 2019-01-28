window.addEventListener('load', () => {
  console.log(data);
  fillSaleSelect();
  fillSaleTable();
});

const fillSaleSelect = () => {
  let select = document.getElementById('saleSelect');
  select.addEventListener('change', fillSaleTable);
  for (let sale of data) {
    console.log(sale);
    let option = document.createElement('option');
    option.value = sale.sale_id;
    option.appendChild(document.createTextNode(sale.sale_id + ' '
      + sale.client + ' ' + sale.date));
    select.appendChild(option)
  }
};

const fillSaleTable = () => {
  const saleInfoDiv = document.getElementById('saleInfo');
  const saleSelect = document.getElementById('saleSelect');

  while(saleInfoDiv.lastChild) {
    saleInfoDiv.removeChild(saleInfoDiv.lastChild);
  }

  for (let sale of data) {
    if (sale.sale_id.toString() === saleSelect.value.toString()) {
      let table = objArrayToTable(sale.products);
      saleInfoDiv.appendChild(table);
      break;
    }
  }
};

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