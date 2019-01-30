window.addEventListener('load', () => {
  console.log(data);
  fillClientsSelect();
  document.getElementById('addProduct').addEventListener('click', addNewProductField);
  document.getElementById('submit').addEventListener('click', sendRequest);
});

window.addEventListener('change', () => {
  updateClientAndDate();
  console.log('xd');
});

let product_index = 0;
let saleData = {
  client: null,
  date: null,
  products: []
};

function fillClientsSelect() {
  let clientSelect = document.getElementById('clientSelect');

  for (let client of data.clients) {
    let option = document.createElement('option');
    option.value = client.client_id;
    option.appendChild(document.createTextNode(client.name));
    clientSelect.appendChild(option);
  }
}

function addNewProductField () {
  let selections = document.getElementById('selections');
  let labeledContainer = document.createElement('div');
  let container = document.createElement('div');
  let select = document.createElement('select');
  let types = ['Beers', 'Wines', 'Liquors'];
  let defaultOption = document.createElement('option');

  let label = document.createElement('label');
  label.className = 'col-form-label';
  label.for = 'div';
  label.appendChild(document.createTextNode('Product ' + (product_index + 1).toString()));
  labeledContainer.appendChild(label);
  labeledContainer.className = 'form-group';
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
  container.id = product_index.toString();
  select.action = '/get_names';
  select.className = 'form-control';
  select.required = true;

  select.addEventListener('change', () => {
    setSecondarySelect(container);
    updateProductsData(container);
  });

  labeledContainer.appendChild(container);
  selections.appendChild(labeledContainer);

  product_index++;
}

function setSecondarySelect(container) {
  let nameSelect = document.createElement('select');
  let quantitySelect = document.createElement('select');

  quantitySelect.className = 'form-control';
  quantitySelect.type = 'number';
  quantitySelect.placeholder = 'Quantity';
  quantitySelect.required = true;
  quantitySelect.step = '1';
  quantitySelect.min = '1';

  nameSelect.required = true;
  nameSelect.className = 'form-control';
  nameSelect.style.marginRight = '10px';
  nameSelect.style.marginLeft = '10px';

  const updateQuantitySelect = () => {
    while (quantitySelect.lastChild) {
      quantitySelect.removeChild(quantitySelect.lastChild);
    }

    const max = JSON.parse(nameSelect.value).quantity;
    if (max === 0) {
      let option = document.createElement('option');
      option.value = 0;
      option.appendChild(document.createTextNode('0'));
      quantitySelect.appendChild(option);
    } else {
      for (let i = 1; i <= max; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.appendChild(document.createTextNode(i.toString()));
        quantitySelect.appendChild(option);
      }
    }
  };

  nameSelect.addEventListener('change', () => {
    updateProductsData(container);
    updateQuantitySelect();
  });

  quantitySelect.addEventListener('change', () => {
    updateProductsData(container);
  });

  for (let obj of data.productsData) {
    if (container.children[0].value.toLowerCase() === obj.name) {
      for (let t of obj.data) {
        let option = document.createElement('option');
        option.value = JSON.stringify({
          product_id: t.product_id,
          quantity: t.quantity
        });
        option.appendChild(document.createTextNode(t.name + " " + t.capacity + "ml"));
        nameSelect.appendChild(option);
      }
    }
  }

  while (container.childElementCount > 1) {
    container.removeChild(container.lastChild);
  }

  updateQuantitySelect();
  container.appendChild(nameSelect);
  container.appendChild(quantitySelect);
}

function updateProductsData(container) {
  try {
    saleData.products[container.id] = {
      category: container.children[0].value,
      product_id: JSON.parse(container.children[1].value).product_id,
      quantity: container.children[2].value
    };
    console.log('Products data of sale data updated.');
  } catch (e) {
    if (e instanceof TypeError) {
      console.log('no children mate');
    } else {
      console.log(e);
    }
  }
}

function updateClientAndDate() {
  saleData.client = document.getElementById('clientSelect').value;
  saleData.date = document.getElementById('dateInput').value;
  console.log('Client and date updated');
}

function sendRequest() {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/plan_sale', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let response = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      showMessage(response);
    }
  };
  xhr.send(JSON.stringify(saleData));
}