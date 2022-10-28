const incompleteBook = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addTodo();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addTodo() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookTitle').value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(
        generatedID,
        inputBookTitle,
        inputBookAuthor,
        inputBookYear,
        false);
    incompleteBook.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
};

document.addEventListener(RENDER_EVENT, function () {
    const uncompleteBookList = document.getElementById('incompleteBook');
    uncompleteBookList.innerHTML = '';

    const completeBookList = document.getElementById('completeBook');
    completeBookList.innerHTML = '';

    for (const todoItem of incompleteBook) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
            uncompleteBookList.append(todoElement);
        } else {
            completeBookList.append(todoElement);
        }
    }
});

function makeTodo(todoObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = todoObject.title;

    const writer = document.createElement('p');
    writer.innerText = todoObject.author;

    const yearRelease = document.createElement('p');
    yearRelease.innerText = todoObject.year;;

    const bookItem = document.createElement('article');
    bookItem.classList.add('book-item');
    bookItem.append(bookTitle, writer, yearRelease);
    bookItem.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = "Not finished reading";

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Delete";

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
        });

        const action = document.createElement('div');
        action.classList.add('action');
        action.append(undoButton, trashButton);

        bookItem.append(action);
    } else {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = "Finished reading";

        undoButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Delete";

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
        });

        const action = document.createElement('div');
        action.classList.add('action');
        action.append(undoButton, trashButton);

        bookItem.append(action);
    }

    return bookItem;
};

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodo(todoId) {
    for (const todoItem of incompleteBook) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId) {
    for (const index in incompleteBook) {
        if (incompleteBook[index].id === todoId) {
            return index;
        }
    }
    return -1;
};

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    incompleteBook.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(incompleteBook);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
};

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            incompleteBook.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
