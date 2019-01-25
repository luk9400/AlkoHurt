window.addEventListener('load', (event) => {
  console.log(data);
  addNewProductField();
});

let category_id = 0;

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
  label.appendChild(document.createTextNode('Product ' + (category_id+1).toString()));
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

  select.addEventListener('change', () => {
    setSecondarySelect(container);
  });

  container.classList.add('product');
  container.classList.add('form-group');
  container.setAttribute( 'id', category_id.toString());
  select.id = 'category' + category_id;
  select.setAttribute('name', 'category');
  select.setAttribute('action', '/get_names');

  select.className = 'form-control';
  labeledContainter.appendChild(container);
  selections.appendChild(labeledContainter);

  category_id++;
  // updateFields(selections.childElementCount);
};

const setSecondarySelect = (container) => {
  let select = document.createElement('select');
  let input = document.createElement('input');

  input.className = 'form-control';
  select.className = 'form-control';
  select.name = 'name';
  select.style.marginRight = '10px';
  select.style.marginLeft = '10px';

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
