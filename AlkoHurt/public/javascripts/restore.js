window.addEventListener('load', function () {
  fillRestoreSelect();
});

function fillRestoreSelect() {
  let restoreSelect = document.getElementById('restoreSelect');

  for (let i = 0; i < files.length; i++) {
    let option = document.createElement('option');
    option.appendChild(document.createTextNode(files[i]));
    restoreSelect.appendChild(option);
  }
}
