const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const tableBody = document.getElementById('tablebody');
const addButton = document.getElementById('add');
const noTasksMessage = document.getElementById('no-tasks');
let serialNumber = 1; // Track the current serial number

// Function to create a new table row
function createTableRow(title, description) {
  const tableRow = document.createElement('tr');

  const serialCell = document.createElement('td');
  serialCell.textContent = serialNumber++;
  serialCell.scope = 'row'; // Set scope for screen readers

  const titleCell = document.createElement('td');
  titleCell.textContent = title;

  const descriptionCell = document.createElement('td');
  descriptionCell.textContent = description;

  const actionsCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('submit-button', 'delete'); // Add classes for styling
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    tableRow.remove();

    // Update serial numbers of remaining rows
    updateSerialNumbers();

    // Check if there are no more rows and show the message
    if (tableBody.children.length === 0) {
      noTasksMessage.style.display = 'block';
      serialNumber = 1; // Reset serial number for new tasks
      localStorage.removeItem('tasks'); // Clear storage if list is empty
    } else {
      // Save tasks to local storage after deletion (excluding deleted row)
      saveTasks();
    }
  });
  actionsCell.appendChild(deleteButton);

  tableRow.appendChild(serialCell);
  tableRow.appendChild(titleCell);
  tableRow.appendChild(descriptionCell);
  tableRow.appendChild(actionsCell);

  return tableRow;
}

// Function to update serial numbers of remaining rows
function updateSerialNumbers() {
  const rows = tableBody.querySelectorAll('tr'); // Get all rows
  for (let i = 0; i < rows.length; i++) {
    rows[i].children[0].textContent = i + 1; // Update serial number cell
  }
}

// Function to load tasks from local storage (on page load)
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks); // Parse JSON string back to array
    for (const task of tasks) {
      const newRow = createTableRow(task.title, task.description);
      tableBody.appendChild(newRow);
      serialNumber = Math.max(serialNumber, task.serialNumber + 1); // Update for highest serial number
    }
  }
}

// Function to save tasks to local storage (on add or delete)
function saveTasks() {
  const tasks = [];
  for (const row of tableBody.children) {
    const serialNumber = parseInt(row.children[0].textContent, 10);
    const title = row.children[1].textContent;
    const description = row.children[2].textContent;
    tasks.push({ serialNumber, title, description });
  }
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Convert array to JSON string
}

// Load tasks from local storage on page load
loadTasks();

// Add event listener to the "Add to list" button
addButton.addEventListener('click', () => {
  const title = titleInput.value.trim(); // Trim leading/trailing whitespace
  const description = descriptionInput.value.trim();

  if (title && description) { // Check if both title and description are provided
    const newRow = createTableRow(title, description);
    tableBody.appendChild(newRow);
    saveTasks(); // Save tasks to local storage after adding

    titleInput.value = ''; // Clear input fields after adding
    descriptionInput.value = '';
  } else {
    alert('Please enter both Title and Description.');
  }
});


