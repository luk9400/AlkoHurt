
function showMessage(response) {
  let messageBox = document.getElementById('messageBox');
  let messageHead = document.createElement('strong');

  if (response.succeeded) {
    clearForm();
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
  }, 1500);
}

function clearForm() {
  let selections = document.getElementById('selections');

  while (selections.lastChild) {
    selections.removeChild(selections.lastChild);
  }
}
