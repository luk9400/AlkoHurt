window.addEventListener('load', () => {
  console.log(data);
  fillSaleSelect();
  fillSaleInfo();
});

const fillSaleSelect = () => {
  let select = document.getElementById('saleSelect');
  select.addEventListener('change', fillSaleInfo);
  for (let sale of data) {
    console.log(sale);
    let option = document.createElement('option');
    option.value = sale.sale_id;
    option.appendChild(document.createTextNode(sale.sale_id + ' '
      + sale.client + ' ' + sale.date));
    select.appendChild(option)
  }
};

const fillSaleInfo = () => {
  const saleInfoDiv = document.getElementById('saleInfo');
  const saleSelect = document.getElementById('saleSelect');

  while(saleInfoDiv.lastChild) {
    saleInfoDiv.removeChild(saleInfoDiv.lastChild);
  }

  for (let sale of data) {
    console.log(saleSelect.value + ' ? ' + sale.sale_id);
    if (sale.sale_id.toString() === saleSelect.value.toString()) {
      let h = document.createElement('h4');
      h.appendChild(document.createTextNode(sale.client + ' | ' + sale.date));
      saleInfoDiv.appendChild(h);

      let pre = document.createElement('pre');
      pre.appendChild(document.createTextNode(JSON.stringify(sale.products, null, 2)));
      saleInfoDiv.appendChild(pre);
    }
  }

};