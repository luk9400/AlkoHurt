const addNewProductField = () => {
  let selections = document.getElementById('selections');
  let container = document.createElement('div');
  let select = document.createElement('select');

  select.addEventListener('change', (event) => {
    // updateSecondarySelect();
  });

  container.appendChild(select);
  selections.appendChild(container);

  updateFields(selections.childElementCount);
};
const updateFields = (child) => {
  let fields = document.querySelector(`#fieldList > select:nth-child(${child})`);
  let tables = document.getElementById('tables');

  while (fields.firstChild) {
    fields.removeChild(fields.firstChild);
  }

  for (let s of schema) {
    if (s.TABLE_NAME === tables[tables.selectedIndex].value) {
      let o = document.createElement('option');
      o.setAttribute('value', s.COLUMN_NAME);
      o.appendChild(document.createTextNode(s.COLUMN_NAME));

      fields.appendChild(o);
    }
  }
}