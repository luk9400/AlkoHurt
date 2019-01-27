window.addEventListener('load', () => {
  console.log(data);
});

window.addEventListener('change', () => {
  updateInfo();
  senRequest();
  console.log('xd');
});

let quantityData = {
  product_id: null,
  date: null
};

const setSecondarySelect = () => {
  let selections = document.getElementById('selections');
  let typeSelect = document.getElementById('typeSelect');
  let nameSelect = document.createElement('select');

  nameSelect.setAttribute('required', 'required');
  nameSelect.className = 'form-control';
  nameSelect.marginLeft = '50px';
  nameSelect.margin = '40px';
  nameSelect.id = 'nameSelect';

  while (selections.childElementCount > 1) {
    selections.removeChild(selections.lastChild);
  }

  for (let type of data.productsData) {
    if (type.name === typeSelect.value) {
      for (let product of type.data) {
        let option = document.createElement('option');
        option.value = product.product_id;
        option.appendChild(document.createTextNode(product.name));
        nameSelect.appendChild(option);
      }
      break;
    }
  }

  selections.appendChild(nameSelect);
};

const updateInfo = () =>  {
  try {
    quantityData.product_id = document.getElementById('nameSelect').value;
    quantityData.date = document.getElementById('dateInput').value;
  } catch (e) {
    console.log(e);
  }
  console.log(quantityData);
};

const senRequest = () => {
  if (quantityData.date !== "" && quantityData.product_id != null) {
    let quantity = document.getElementById('quantity')
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/show_quantity', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      let result = JSON.parse(xhr.responseText);
      console.log(result);
      if (xhr.readyState === 4 && xhr.status === 200) {
        quantity.removeChild(quantity.lastChild);
        quantity.appendChild(document.createTextNode(result.quantity));
      }
    };
    xhr.send(JSON.stringify(quantityData));
  }
};
