window.addEventListener('load', () => {
  document.getElementById('submit').addEventListener('click', sendRequest);
});

function sendRequest() {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/add_beer', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let response = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      showMessage(response);
    }
  };
  let name = document.getElementById('nameInput').value;
  let brew = document.getElementById('brewInput').value;
  let abv = document.getElementById('abvInput').value;
  let type = document.getElementById('typeInput').value;
  let capacity = document.getElementById('capacityInput').value;
  let container_type = document.getElementById('containerSelect').value;
  let price = document.getElementById('priceInput').value;

  xhr.send(JSON.stringify({
    name: name,
    brew: brew,
    abv: abv,
    type: type,
    capacity: capacity,
    container_type: container_type,
    price: price
  }));
}

function showMessage(response) {
  let messageBox = document.getElementById('messageBox');
  let messageHead = document.createElement('strong');

  if (response.succeeded) {
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