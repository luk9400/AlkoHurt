window.addEventListener('load', () => {
  console.log(data);
  fillSupplySelect();
  fillSupplyInfo();
});

const fillSupplySelect = () => {
  let select = document.getElementById('supplySelect');
  select.addEventListener('change', fillSupplyInfo);
  for (let supply of data) {
    // console.log(supply);
    let option = document.createElement('option');
    option.value = supply.supply_id;
    option.appendChild(document.createTextNode(supply.supply_id + ' '
      + supply.supplier + ' ' + supply.date));
    select.appendChild(option)
  }
};

const fillSupplyInfo = () => {
  const supplyInfoDiv = document.getElementById('supplyInfo');
  const supplySelect = document.getElementById('supplySelect');

  while(supplyInfoDiv.lastChild) {
    supplyInfoDiv.removeChild(supplyInfoDiv.lastChild);
  }

  for (let supply of data) {
    console.log(supplySelect.value + ' ? ' + supply.supply_id);
    if (supply.supply_id.toString() === supplySelect.value.toString()) {
      let h = document.createElement('h4');
      h.appendChild(document.createTextNode(supply.supplier + ' | ' + supply.date));
      supplyInfoDiv.appendChild(h);

      let pre = document.createElement('pre');
      pre.appendChild(document.createTextNode(JSON.stringify(supply.products, null, 2)));
      supplyInfoDiv.appendChild(pre);
    }
  }

};