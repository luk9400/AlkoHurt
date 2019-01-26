window.addEventListener('load', (event) => {
  console.log(data);
  addNewProductField();
  fillSuppliersSelect();
});

let product_index = 0;
let supplyData = {
  supplier: null,
  date: null,
  products: []
};

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
  // select.placeholder = 'Product type'
  labeledContainter.className = 'form-group';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.appendChild(document.createTextNode('Product type'));
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
    updateProductsData(container);
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
    updateProductsData(container);
  });
  quantityInput.addEventListener('change', () => {
    updateProductsData(container);
  });

  for (let obj of data.productsData) {
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

function updateSupplierAndDate() {
  supplyData.supplier = document.getElementById('supplierSelect').value;
  supplyData.date = document.getElementById('dateInput').value;
}

function updateProductsData(container) {
  try {
    supplyData.products[container.id] = {
      category: container.children[0].value,
      product_id: container.children[1].value,
      quantity: container.children[2].value
    };
  } catch (e) {
    if (e instanceof TypeError) {
      console.log('no children mate');
    } else {
      console.log(e);
    }
  }
}

const fillSuppliersSelect = () => {
  let supplierSelect = document.getElementById('supplierSelect');

  for (let supplier of data.suppliers) {
    let option = document.createElement('option');
    option.value = supplier.supplier_id;
    option.appendChild(document.createTextNode(supplier.name));
    supplierSelect.appendChild(option);
  }
};

const sendRequest = () => {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/plan_supply/', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  console.log(JSON.stringify(supplyData));
  xhr.send(JSON.stringify(supplyData));
};


