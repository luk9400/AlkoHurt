window.addEventListener('load', (event) => {
  console.log(data);
  addNewProductField();
});


const addNewProductField = () => {
  let selections = document.getElementById('selections');
  let container = document.createElement('div');
  let select = document.createElement('select');
  let types = ['Beers', 'Wines', 'Liquors'];
  let defaultOption = document.createElement('option');
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.value = "";
  defaultOption.appendChild(document.createTextNode('--select product type--'));
  select.appendChild(defaultOption);
  for (type of types) {
    let option = document.createElement('option');
    option.value = type;
    option.appendChild(document.createTextNode(type));
    select.appendChild(option);
  }

  container.appendChild(select);

  select.addEventListener('change', (event) => {
    setSecondarySelect(container);
  });
  select.setAttribute('action', '/get_names');
  selections.appendChild(container);

  // updateFields(selections.childElementCount);
};

const setSecondarySelect = (container) => {
  let select = document.createElement('select');
  let input = document.createElement('input');

  for (let obj of data) {
    console.log(obj);
    if (container.children[0].value.toLowerCase() === obj.name) {
      console.log('xD');
      for (let t of obj.data) {
        console.log(t);
        let option = document.createElement('option');
        option.value = t.product_id;
        option.appendChild(document.createTextNode(t.name + " " + t.capacity + "ml"));
        select.appendChild(option);
      }
    }

  }

  input.type = 'number';
  input.step = '1';
  input.min = '0';
  while (container.childElementCount > 1) {
    container.removeChild(container.lastChild);
  }

  container.appendChild(select);
  container.appendChild(input);
};
