window.addEventListener('load', () => {
  console.log(data);
  fillSupplySelect()
});

const fillSupplySelect = () => {
  let select = document.getElementById('supplySelect');
  for (let supply of data) {
    console.log(supply);
    let option = document.createElement('option');
    option.value = supply.supply_id;
    option.appendChild(document.createTextNode(supply.supply_id + ' '
      + supply.supplier + ' ' + supply.date));
    select.appendChild(option)
  }
};
