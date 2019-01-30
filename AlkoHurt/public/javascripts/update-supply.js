window.addEventListener('load', () => {
  console.log(data);
  fillSupplySelect();
  fillSupplyTable();
  document.getElementById('submit').addEventListener('click', sendRequest);
});

function fillSupplySelect() {
  let select = document.getElementById('supplySelect');
  select.addEventListener('change', fillSupplyTable);
  for (let supply of data) {
    let option = document.createElement('option');
    option.value = supply.supply_id;
    option.appendChild(document.createTextNode(supply.supplier + ' ' + supply.date));
    select.appendChild(option)
  }
}

function fillSupplyTable() {
  const supplyInfoDiv = document.getElementById('supplyInfo');
  const supplySelect = document.getElementById('supplySelect');

  while(supplyInfoDiv.lastChild) {
    supplyInfoDiv.removeChild(supplyInfoDiv.lastChild);
  }

  for (let supply of data) {
    if (supply.supply_id.toString() === supplySelect.value.toString()) {
      let table = objArrayToTable(supply.products);
      supplyInfoDiv.appendChild(table);
      break;
    }
  }
}

function sendRequest() {
  let xhr = new XMLHttpRequest();
  let supplySelect = document.getElementById('supplySelect');
  xhr.open('POST', '/update_supply', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let response = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      showMessage(response);
    }
  };
  xhr.send(JSON.stringify({
    supply_id: supplySelect.value
  }));
}

function showMessage(response) {
  let messageBox = document.getElementById('messageBox');
  let messageHead = document.createElement('strong');

  if (response.succeeded) {
    clearSupplySelect();
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

function clearSupplySelect() {
  let supplySelect = document.getElementById('supplySelect') ;

  for (let option of supplySelect) {
    if (option.value === supplySelect.value) {
      supplySelect.removeChild(option);
      break;
    }
  }
}