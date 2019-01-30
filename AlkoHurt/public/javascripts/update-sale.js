window.addEventListener('load', () => {
  console.log(data);
  fillSaleSelect();
  fillSaleTable();
  document.getElementById('submit').addEventListener('click', sendRequest);
});

function fillSaleSelect() {
  let select = document.getElementById('saleSelect');
  select.addEventListener('change', fillSaleTable);
  for (let sale of data) {
    console.log(sale);
    let option = document.createElement('option');
    option.value = sale.sale_id;
    option.appendChild(document.createTextNode(sale.client + ' ' + sale.date));
    select.appendChild(option)
  }
}

function fillSaleTable() {
  const saleInfoDiv = document.getElementById('saleInfo');
  const saleSelect = document.getElementById('saleSelect');

  while(saleInfoDiv.lastChild) {
    saleInfoDiv.removeChild(saleInfoDiv.lastChild);
  }

  for (let sale of data) {
    if (sale.sale_id.toString() === saleSelect.value.toString()) {
      let table = objArrayToTable(sale.products);
      saleInfoDiv.appendChild(table);
      break;
    }
  }
}

function sendRequest() {
  let xhr = new XMLHttpRequest();
  let saleSelect = document.getElementById('saleSelect');
  xhr.open('POST', '/update_sale', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let response = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      showMessage(response);
    }
  };
  xhr.send(JSON.stringify({
    sale_id: saleSelect.value
  }));
}

function showMessage(response) {
  let messageBox = document.getElementById('messageBox');
  let messageHead = document.createElement('strong');

  if (response.succeeded) {
    clearSaleSelect();
    messageHead.appendChild(document.createTextNode('Success!'));
    messageBox.className = 'alert alert-dismissible alert-success';
  } else {
    messageHead.appendChild(document.createTextNode('Oh snap!'));
    messageBox.className = 'alert alert-dismissible alert-danger';
  }

  messageBox.appendChild(messageHead);
  messageBox.appendChild(document.createTextNode(' ' + response.message));
  setTimeout(() => {
    while (messageBox.lastChild) {
      messageBox.removeChild(messageBox.lastChild);
    }
    messageBox.classList = null;
  }, 2000);
}

function clearSaleSelect() {
  let saleSelect = document.getElementById('saleSelect') ;

  for (let option of saleSelect) {
    if (option.value === saleSelect.value) {
      saleSelect.removeChild(option);
      break;
    }
  }
}