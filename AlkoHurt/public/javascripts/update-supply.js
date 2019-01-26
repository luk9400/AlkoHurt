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

  for (let supply of data) {
    console.log(supplySelect.value + ' ? ' + supply.supply_id);
    if (supply.supply_id.toString() === supplySelect.value.toString()) {
      console.log('dupa');
      console.log(...supply.products);
      let p = document.createElement('p');
      p.appendChild(document.createTextNode(JSON.stringify(...supply.products)));
      while(supplyInfoDiv.lastChild) {
        supplyInfoDiv.removeChild(supplyInfoDiv.lastChild);
      }
      supplyInfoDiv.appendChild(p);
    }
  }

};