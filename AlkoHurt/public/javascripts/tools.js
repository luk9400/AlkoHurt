window.addEventListener('load', (event) => {
  console.log(data);
  addNewProductField();
});

let category_id = 0;

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

  select.addEventListener('change', () => {
    setSecondarySelect(container);
  });

  container.setAttribute('id', category_id.toString());
  select.setAttribute('name', 'category');
  select.setAttribute('action', '/get_names');
  selections.appendChild(container);

  category_id++;
  // updateFields(selections.childElementCount);
};

const setSecondarySelect = (container) => {
  let select = document.createElement('select');
  let input = document.createElement('input');

  select.name = 'name';

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

  input.name = 'number';
  input.type = 'number';
  input.step = '1';
  input.min = '0';

  while (container.childElementCount > 1) {
    container.removeChild(container.lastChild);
  }

  container.appendChild(select);
  container.appendChild(input);
};

const updateSupplyData = () => {
  let divs = document.getElementById('selections').children;
  for (let div of divs) {
    console.log(div);
  }
  console.log();
  supply_data = {
    supplier: document.getElementById('supplierInput').value,
    date: document.getElementById('dateInput').value
    // products: document.getElementById('selections').children.

  }
};
