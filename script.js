const todolist = JSON.parse(localStorage.getItem('todolist')) || [];
let currentFilter = 'all';

window.addEventListener('DOMContentLoaded', () => {
    const allButton = document.querySelector('.filters button');
    setFilter('all', allButton);

    const monthButton = document.getElementById('monthButton');
    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    const currentMonth = new Date().getMonth();
    monthButton.innerText = monthNames[currentMonth];
});

function setFilter(filter, clickedButton) {
    currentFilter = filter;
    const buttons = document.querySelectorAll('.filter-button');

    buttons.forEach((button) => {
        if (button === clickedButton) {
            button.classList.add('filter-button-active');
        }
        else {
            button.classList.remove('filter-button-active');
        }
    });
    renderTodoList();
}

function renderTodoList() {
    let todolistHTML = '';
    const now = new Date();

    todolist.sort((a, b) => {
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    for (let i = 0; i < todolist.length; i++) {
        const todoObject = todolist[i];
        //const name = todoObject.name;
        //const dueDate = todoObject.dueDate;
        const { name, dueDate } = todoObject;

        const dateObj = new Date(dueDate);

        let show = false;
        if (currentFilter === 'all') {
            show = true;
        }
        else if (currentFilter === 'today') {
            show = dateObj.toDateString() === now.toDateString();
        }
        else if (currentFilter === 'week') {
            const current = new Date(now);

            const day = current.getDay();
            const diffToMonday = day === 0 ? -6 : 1 - day;

            const monday = new Date(current);
            monday.setDate(current.getDate() + diffToMonday);
            monday.setHours(0, 0, 0, 0);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            sunday.setHours(23, 59, 59, 999);

            show = dateObj >= monday && dateObj <= sunday;
        }
        else if (currentFilter === 'month') {
            show = dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
        }
        if (!show) continue;

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

function requestNotificationPermission() {

    if (Notification.permission === "granted") {
        alert("Notifications already enabled.");
        return;
    }

    Notification.requestPermission().then((permission) => {

    if (permission === "granted") {
        alert("Notifications enabled!");
    }
    else {
        alert("Notifications denied. Check your browser settings.");
    }
    });
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

renderTodoList();
checkDueTasks();
setInterval(checkDueTasks, 10000);
