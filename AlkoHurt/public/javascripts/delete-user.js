window.addEventListener('load', function () {
  fillUserSelect();
});

function fillUserSelect() {
  let userSelect = document.getElementById('userSelect');

  for (let user of users) {
    let option = document.createElement('option');
    option.appendChild(document.createTextNode(user.login));
    userSelect.appendChild(option);
  }
}
