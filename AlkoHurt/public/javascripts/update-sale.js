window.addEventListener('load', () => {
  console.log(data);
  fillSaleSelect();
  fillSaleTable();
});

function fillSaleSelect() {
  let select = document.getElementById('saleSelect');
  select.addEventListener('change', fillSaleTable);
  for (let sale of data) {
    console.log(sale);
    let option = document.createElement('option');
    option.value = sale.sale_id;
    option.appendChild(document.createTextNode(sale.client + ' ' + sale.date));
    select.appendChild(option)
  }
}

function fillSaleTable() {
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
}
