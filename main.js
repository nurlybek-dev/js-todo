"use strict";

const FILTER_ALL = "all";
const FILTER_ACTIVE = "active";
const FILTER_COMPLETED = "completed";

const todoList = document.querySelector(".todo-list");
const newInput = document.querySelector(".new-todo");
const listCount = document.querySelector(".todo-count");
const clearCompleted = document.querySelector(".clear-completed");
const filters = document.querySelectorAll(".filters li a");

let listItems = JSON.parse(localStorage.getItem("todoList"));
let activeFilter = localStorage.getItem("activeFilter");

if (activeFilter == null) {
    activeFilter = FILTER_ALL;
}

updateList();

filters.forEach(filter => {
    if (filter.dataset.filter == activeFilter) {
        filter.classList.add("selected");
    }

    filter.addEventListener("click", function (event) {
        event.preventDefault();

        let target = event.target;
        activeFilter = target.dataset.filter;

        localStorage.setItem("activeFilter", activeFilter);
        toggleSelected(target);
        updateList();
    });
});

function updateList() {
    todoList.innerHTML = null;

    let currentListItems = getFilteredItems();

    for (let key in currentListItems) {
        let value = currentListItems[key]["value"];
        let completed = currentListItems[key]["completed"];
        createListItem(value, key, completed);
    }

    localStorage.setItem("todoList", JSON.stringify(listItems));
    listCount.innerText = todoList.childElementCount;
}

function getFilteredItems() {
    if (activeFilter == FILTER_ALL) {
        return listItems;
    }

    let completed = (activeFilter == FILTER_ACTIVE) ? false : true;
    let currentListItems = {};
    for (let key in listItems) {
        let itemCompleted = listItems[key]["completed"];
        if (completed == itemCompleted) {
            currentListItems[key] = listItems[key];
        }
    }
    return currentListItems;
}

function toggleSelected(target) {
    filters.forEach(element => {
        element.classList.remove("selected");
    });
    target.classList.add("selected");
}

clearCompleted.addEventListener("click", function (event) {
    event.preventDefault();

    let completedItems = document.querySelectorAll(".completed");
    completedItems.forEach(item => {
        if (isItemInList(item.id)) {
            delete listItems[item.id];
        }
    });
    updateList();
});

newInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();

        let newInputValue = newInput.value.trim();
        if (!newInputValue) return;

        let id = Date.now();
        listItems[id] = {
            value: newInputValue,
            completed: false
        };

        updateList();
        newInput.value = "";
    }
});

function createListItem(value, id, completed) {
    let item = document.createElement("li");
    item.classList.add("todo-list-item");
    item.onclick = toggle;
    item.id = id;
    if (completed) item.classList.add("completed");

    let label = document.createElement("p");
    label.innerText = value;

    let removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    removeButton.innerText = "X";
    removeButton.onclick = remove;

    item.appendChild(label);
    item.appendChild(removeButton);

    todoList.appendChild(item);
}

function remove(event) {
    let removeButton = event.target;
    let listItem = removeButton.closest("li");

    if (isItemInList(listItem.id)) {
        delete listItems[listItem.id];
    }
    updateList();
}

function toggle(event) {
    let target = event.target;
    let listItem = target.closest("li");
    listItem.classList.toggle("completed");
    if (isItemInList(listItem.id)) {
        listItems[listItem.id]["completed"] = listItem.classList.contains("completed");
    }
    updateList();
}

function isItemInList(item) {
    return item in listItems;
}