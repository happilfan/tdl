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
        name, dueDate
    });

    localStorage.setItem('todolist', JSON.stringify(todolist));

    inputElement.value = '';
    dateInputElement.value = '';

    renderTodoList();
}