window.addEventListener('load', (event) => {
  console.log(data);
  addNewProductField();
});

let product_index = 0;
let supplyData = [];

const addNewProductField = () => {
  let selections = document.getElementById('selections');
  let labeledContainter = document.createElement('div');
  let container = document.createElement('div');
  let select = document.createElement('select');
  let types = ['Beers', 'Wines', 'Liquors'];
  let defaultOption = document.createElement('option');

  let label = document.createElement('label');
  label.className = 'col-form-label';
  label.for = 'div';
  label.appendChild(document.createTextNode('Product ' + (product_index + 1).toString()));
  labeledContainter.appendChild(label);

  labeledContainter.className = 'form-group';
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

  container.classList.add('product');
  container.classList.add('form-group');
  container.setAttribute('id', product_index.toString());
  select.setAttribute('action', '/get_names');
  select.className = 'form-control';
  select.setAttribute('required', 'required');

  select.addEventListener('change', () => {
    setSecondarySelect(container);
    updateSupplyData(container);
  });


  labeledContainter.appendChild(container);
  selections.appendChild(labeledContainter);

  product_index++;
};

const setSecondarySelect = (container) => {
  let nameSelect = document.createElement('select');
  let quantityInput = document.createElement('input');

  quantityInput.className = 'form-control';
  quantityInput.type = 'number';
  quantityInput.placeholder = 'Quantity';
  quantityInput.setAttribute('required', 'required');
  quantityInput.step = '1';
  quantityInput.min = '1';
  nameSelect.setAttribute('required', 'required');
  nameSelect.className = 'form-control';
  nameSelect.style.marginRight = '10px';
  nameSelect.style.marginLeft = '10px';

  nameSelect.addEventListener('change', () => {
    updateSupplyData(container);
  });
  quantityInput.addEventListener('change', () => {
    updateSupplyData(container);
  });

  for (let obj of data) {
    if (container.children[0].value.toLowerCase() === obj.name) {
      for (let t of obj.data) {
        let option = document.createElement('option');
        option.value = t.product_id;
        option.appendChild(document.createTextNode(t.name + " " + t.capacity + "ml"));
        nameSelect.appendChild(option);
      }
    }
  }


  while (container.childElementCount > 1) {
    container.removeChild(container.lastChild);
  }

  container.appendChild(nameSelect);
  container.appendChild(quantityInput);
};

function updateSupplyData(container) {
  try {
    supplyData[container.id] = {
      category: container.children[0].value,
      product_id: container.children[1].value,
      quantity: container.children[2].value
    };
    console.log(supplyData);
  } catch (e) {
    if (e instanceof TypeError) {
      console.log('no children mate');
    } else {
      console.log(e);
    }
  }
}

const sendRequest = () => {
  let sa = require('superagent');
};
