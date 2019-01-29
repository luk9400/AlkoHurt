window.addEventListener('load', function () {
  console.log(data);
  fillRestoreSelect();
});

function fillRestoreSelect() {
  let restoreSelect = document.getElementById('restoreSelect');

  for (let i = 0; i < data.length; i++) {
    let option = document.createElement('option');
    option.value = i;
    option.appendChild(document.createTextNode(data[i]));
    restoreSelect.appendChild(option);
  }
}