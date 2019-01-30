window.addEventListener('load', () => {
  document.getElementById('submit').addEventListener('click', sendRequest);
});

function sendRequest() {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/add_liquor', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let response = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      showMessage(response);
    }
  };
  let name = document.getElementById('nameInput').value;
  let type = document.getElementById('typeSelect').value;
  let abv = document.getElementById('abvInput').value;
  let capacity = document.getElementById('capacityInput').value;
  let price = document.getElementById('priceInput').value;

  xhr.send(JSON.stringify({
    name: name,
    type: type,
    abv: abv,
    capacity: capacity,
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