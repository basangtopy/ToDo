const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const todos = document.getElementById('todos');
const tasks = document.getElementById('tasks');
const count = document.getElementById('count');
const clrBtn = document.querySelector('.clr');


// Display items in storage 
function displayTasks(){
    const tasksFromStorage = getTasksFromStorage();

    tasksFromStorage.forEach(todo => addTodoToDom(todo));

    checkUI();
}

// Create task
function createTodo(todo){
    // const todo = taskInput.value;
    const li = document.createElement('li');

    li.className = 'task';
    li.appendChild(createCheckbox());
    li.appendChild(document.createTextNode(todo));
    li.appendChild(taskModifyButtons());

    return li;
}

// Add Task to DOM 
function addTodoToDom(todo){
    const task = createTodo(todo);
    tasks.appendChild(task);
}

// Create Checkbox
function createCheckbox(){
    const checkBox = document.createElement('input');
    checkBox.className = 'mark-complete';
    checkBox.type = 'checkbox';
    checkBox.name = 'mark-complete';

    return checkBox
}

// Create Task Buttons
function taskModifyButtons(){
    const modifyTaskBtns = document.createElement('div');
    modifyTaskBtns.className = 'modify-task'

    // Edit Button 
    modifyTaskBtns.appendChild(createTaskBtn('edit-task modify-task-btn', 'fa-solid fa-pen'));

    // Delete Button 
    modifyTaskBtns.appendChild(createTaskBtn('delete-task modify-task-btn', 'fa-solid fa-x'));

    return modifyTaskBtns;
}

// Create Edit Task Button
function createTaskBtn(anchorClasses, iconClasses){
    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.className = anchorClasses;

    // Create the icon element
    const icon = document.createElement('i');
    icon.className = iconClasses;

    // Append the icon to the anchor element
    anchor.appendChild(icon);

    return anchor;
}

// Add Todo to Tasks
function addTodoToTasks(){
    const newTask = taskInput.value
    if(newTask === ''){
        alert('Please input a task!');
        return;
    }

    if(checkIfTaskExists(newTask)){
        alert('That item is already in the list!');
        return;
    }

    // Add task to DOM 
    addTodoToDom(newTask);

    // Add task to Storage 
    addTaskToStorage(newTask);

    checkUI();
}

// Modify Task
function modifyTodo(e){
    if(e.target.parentElement.classList.contains('delete-task')){
        deleteTask(e.target.parentElement.parentElement.parentElement);
    } else if(e.target.parentElement.classList.contains('edit-task')){
        editTodo(e.target.parentElement.parentElement.parentElement);
    }

    checkUI();
}

// Delete Todo 
function deleteTask(todo){
    if(confirm('Are you sure you want to remove this from the tasks?')) {
        // Remove from DOM 
        todo.remove();

        // Remove from storage 
        removeTaskFromStorage(todo.textContent);
    }
}

// Edit Todo 
function editTodo(todo){
    taskInput.value = todo.textContent;
    // Remove from DOM 
    todo.remove();

    // Remove from storage 
    removeTaskFromStorage(todo.textContent);
}

// Mark Completed
function markComplete(e){
 let checkBox = e.target;
    if(checkBox.classList.contains('mark-complete')){
        if(checkBox.checked){
            checkBox.parentElement.style.textDecoration = 'line-through';
            checkBox.parentElement.style.color = 'hsl(236, 9%, 61%)';
            checkBox.parentElement.classList.add('checked');
            checkBox.parentElement.querySelector('.edit-task').style.display = 'none';
        } else {
            checkBox.parentElement.style.textDecoration = 'none';
            checkBox.parentElement.style.color = 'black';
            checkBox.parentElement.classList.remove('checked');
            checkBox.parentElement.querySelector('.edit-task').style.display = 'block';
        }
    }

    checkUI();
}

// Clear Tasks 
function clearItems() {
    if(confirm('Are you sure you want to clear all tasks?')){
        // Clear from DOM 
        tasks.innerHTML = '';

        // Clear from locale storage 
        localStorage.removeItem('ToDoTasks');
    }

    checkUI();
}

// Check UI 
function checkUI(){
    taskInput.value = '';
    const tasksList = document.querySelectorAll('li');

    if(tasksList.length === 0){
        todos.style.display = 'none';
    } else {
        todos.style.display = 'block';
    }

    // Task count
    const checkedTasks = document.querySelectorAll('.checked').length;
    const taskCount = tasksList.length - checkedTasks;

    count.innerText = taskCount; 
}


// Local Storage
function getTasksFromStorage(){
    let tasksFromStorage;

    if(localStorage.getItem('ToDoTasks') === null) {
        tasksFromStorage = [];
    } else {
        tasksFromStorage = JSON.parse(localStorage.getItem('ToDoTasks'));
    }

    return tasksFromStorage;
}

// Add Task To Storage 
function addTaskToStorage(todo){
    let tasksFromStorage = getTasksFromStorage();

    // Add new ToDo to array 
    tasksFromStorage.push(todo);

    // Convert to JSON string and set to local storage 
    localStorage.setItem('ToDoTasks', JSON.stringify(tasksFromStorage));
}

// Remove Task From Storage 
function removeTaskFromStorage(todo){
    let tasksFromStorage = getTasksFromStorage();

    tasksFromStorage = tasksFromStorage.filter(i => i !== todo);

    localStorage.setItem('ToDoTasks', JSON.stringify(tasksFromStorage));
}

// Check If Task Exists 
function checkIfTaskExists(todo){
    tasksFromStorage = getTasksFromStorage().map(item => item.toLowerCase());

    return tasksFromStorage.includes(todo.toLowerCase());
}

addBtn.addEventListener('click', addTodoToTasks);
tasks.addEventListener('click', modifyTodo);
tasks.addEventListener('change', markComplete);
clrBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', displayTasks);
checkUI();