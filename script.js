const todolist = JSON.parse(localStorage.getItem('todolist')) || [];

renderTodoList();

function renderTodoList() {
    let todolistHTML = '';

    for (let i = 0; i < todolist.length; i++) {
        const todoObject = todolist[i];
        //const name = todoObject.name;
        //const dueDate = todoObject.dueDate;
        const { name, dueDate } = todoObject;

        const dateObj = new Date(dueDate);

        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        const formattedDate = `${day}.${month}.${year} | ${hours}:${minutes}`;

        const html = `
            <li>${name}</li>
            <div>${formattedDate}</div>
            <button onclick="
                todolist.splice(${i}, 1);
                localStorage.setItem('todolist', JSON.stringify(todolist));
                renderTodoList();
            " class="delete-button">Delete</button>
        `;
        todolistHTML += html;
    }

    document.querySelector('.js-todo-list')
        .innerHTML = todolistHTML;
}

function addTodo() {
    const inputElement = document.querySelector('.js-name-input');
    const name = inputElement.value;

    const dateInputElement = document.querySelector('.js-date-input');
    const dueDate = dateInputElement.value;

    if (!name || !dueDate) {
        alert('Please enter a task and select a date.');
        return;
    }

    todolist.push({
        //name: name,
        //dueDate: dueDate
        name, dueDate,
        notified: false
    });

    localStorage.setItem('todolist', JSON.stringify(todolist));

    inputElement.value = '';
    dateInputElement.value = '';

    renderTodoList();
}

function checkDueTasks() {
    const now = new Date();

    todolist.forEach(todo => {
        const due = new Date(todo.dueDate);

        if (!todo.notified && now >= due) {
            new Notification("Task Reminder", {
                body: todo.name,
            });

            todo.notified = true;

            localStorage.setItem('todolist', JSON.stringify(todolist));
        }
    });
}

async function requestNotificationPermission() {

    if (Notification.permission === "granted") {
        alert("Notifications already enabled.");
        return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        alert("Notifications enabled!");
    }
    else {
        alert("Notifications denied. Check your browser settings.");
    }
}

const body = document.body;
const button = document.getElementById('changeTheme');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    body.classList.add('light-mode');
    button.innerHTML = '<img src="./Mr_Shine.png" class="ch-pic">';
}
else {
    body.classList.remove('light-mode');
    button.innerHTML = '<img src="./Mr_Bright_2.png" class="ch-pic">';
}

function changeTheme() {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        button.innerHTML = '<img src="./Mr_Shine.png" class="ch-pic">';
        localStorage.setItem('theme', 'light');
    }
    else {
        button.innerHTML = '<img src="./Mr_Bright_2.png" class="ch-pic">';
        localStorage.setItem('theme', 'dark');
    }
}

setInterval(checkDueTasks, 10000);
checkDueTasks();
