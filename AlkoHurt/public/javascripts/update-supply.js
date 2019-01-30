window.addEventListener('load', () => {
  console.log(data);
  fillSupplySelect();
  fillSupplyTable();
});

function fillSupplySelect() {
  let select = document.getElementById('supplySelect');
  select.addEventListener('change', fillSupplyTable);
  for (let supply of data) {
    let option = document.createElement('option');
    option.value = supply.supply_id;
    option.appendChild(document.createTextNode(supply.supplier + ' ' + supply.date));
    select.appendChild(option)
  }
}

function fillSupplyTable() {
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
}
