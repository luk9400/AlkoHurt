window.addEventListener('load', () => {
  fillTableSelect();
  fillAvailableColumnsArray();
  fillFirstColumnSelect();
  document.getElementById('addColumn').addEventListener('click', addColumnSelect);
  document.getElementById('submit').addEventListener('click', updateQueryColumns);
  document.getElementById('submit').addEventListener('click', showQueryTable);
  document.getElementById('selectAll').addEventListener('click', selectAll);
});

let availableColumns = [];
let queryColumns = [];

function fillTableSelect() {
  let tableSelect = document.getElementById('tableSelect');
  let tables = [];
  for (let obj of schema) {
    if (!tables.includes(obj.table_name)) {
      tables.push(obj.table_name);
    }
  }
  for (let table of tables) {
    let option = document.createElement('option');
    option.value = table;
    option.appendChild(document.createTextNode(table));
    tableSelect.appendChild(option);
  }
  tableSelect.addEventListener('change', resetColumnSelects);
  tableSelect.addEventListener('change', fillAvailableColumnsArray);
  tableSelect.addEventListener('change', fillFirstColumnSelect);
}

function fillAvailableColumnsArray() {
  let tableSelect = document.getElementById('tableSelect');
  availableColumns = [];
  for (let obj of schema) {
    if (obj.table_name === tableSelect.value) {
      availableColumns.push(obj.column_name);
    }
  }
}

function resetColumnSelects() {
  let columns = document.getElementById('columnsDiv');
  while (columns.childElementCount > 1) {
    columns.removeChild(columns.lastChild);
  }
}

function fillFirstColumnSelect() {
  let column0 = document.getElementById('column0');
  while (column0.lastChild) {
    column0.removeChild(column0.lastChild);
  }
  for (let column of availableColumns) {
    let option = document.createElement('option');
    option.value = column;
    option.appendChild(document.createTextNode(column));
    column0.appendChild(option);
  }
  updateQueryColumns();
}

function addColumnSelect() {
  let columns = document.getElementById('columnsDiv');

  let select = document.createElement('select');
  select.className = 'form-control';

  for (let column of availableColumns) {
    let option = document.createElement('option');
    option.value = column;
    option.appendChild(document.createTextNode(column));
    select.appendChild(option);
  }
  updateQueryColumns();
  select.addEventListener('change', updateQueryColumns);
  columns.appendChild(select);
}

function updateQueryColumns() {
  let columns = document.getElementById('columnsDiv');
  queryColumns = [];
  for (let column of columns.children) {
    if (!queryColumns.includes(column.value) && availableColumns.includes(column.value)) {
      queryColumns.push(column.value);
    }
  }
}

function showQueryTable() {
  let xhr = new XMLHttpRequest();
  let tableSelect = document.getElementById('tableSelect');
  let tableDiv = document.getElementById('tableDiv');

  xhr.open('POST', '/custom_query', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    let result = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      while (tableDiv.lastChild) {
        tableDiv.removeChild(tableDiv.lastChild);
      }
      tableDiv.appendChild(objArrayToTable(result.result));
    }
  };
  xhr.send(JSON.stringify({
    table: tableSelect.value,
    columns: queryColumns
  }));
}

function selectAll() {
  resetColumnSelects();
  fillAvailableColumnsArray();
  queryColumns = availableColumns;
  showQueryTable();
}