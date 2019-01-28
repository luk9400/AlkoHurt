window.addEventListener('load', () => {
  console.log(data);
  fillSupplySelect();
  // fillSupplyInfo();
  fillSupplyTable();
});

const fillSupplySelect = () => {
  let select = document.getElementById('supplySelect');
  // select.addEventListener('change', fillSupplyInfo);
  select.addEventListener('change', fillSupplyTable);
  for (let supply of data) {
    let option = document.createElement('option');
    option.value = supply.supply_id;
    option.appendChild(document.createTextNode(supply.supply_id + ' '
      + supply.supplier + ' ' + supply.date));
    select.appendChild(option)
  }
};

const fillSupplyTable = () => {
  const supplyInfoDiv = document.getElementById('supplyInfo');
  const supplySelect = document.getElementById('supplySelect');

  while(supplyInfoDiv.lastChild) {
    supplyInfoDiv.removeChild(supplyInfoDiv.lastChild);
  }

  for (let supply of data) {
    if (supply.supply_id.toString() === supplySelect.value.toString()) {
      let table = objArrayToTable(supply.products);
      supplyInfoDiv.appendChild(table);
      break;
    }
  }
};

// We assume that every object has the same keys
function objArrayToTable(objArray) {
  let table = document.createElement('table');
  table.className = 'table table-active';
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