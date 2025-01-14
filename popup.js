document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("new-todo");
  const todoList = document.getElementById("todo-list");
  const addButton = document.querySelector(".add-btn");
  const emptyState = document.querySelector(".empty-state");

  function updateEmptyState() {
    if (todoList.children.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }
  }

  chrome.storage.local.get(["todos"], (result) => {
    const todos = result.todos || [];
    todos.forEach((todo) => addTodoElement(todo));
    updateEmptyState();
  });

  function addNewTodo() {
    if (todoInput.value.trim()) {
      const newTodo = {
        id: Date.now(),
        text: todoInput.value.trim(),
        completed: false,
      };

      chrome.storage.local.get(["todos"], (result) => {
        const todos = result.todos || [];
        todos.push(newTodo);
        chrome.storage.local.set({ todos });
      });

      addTodoElement(newTodo);
      todoInput.value = "";
      updateEmptyState();
    }
  }

  addButton.addEventListener("click", addNewTodo);

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addNewTodo();
    }
  });

  function addTodoElement(todo) {
    const div = document.createElement("div");
    div.className = `todo-item ${todo.completed ? "completed" : ""}`;
    div.innerHTML = `
      <div class="checkbox-wrapper">
        <input type="checkbox" class="custom-checkbox" ${
          todo.completed ? "checked" : ""
        }>
      </div>
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;

    const checkbox = div.querySelector(".custom-checkbox");
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      div.classList.toggle("completed");

      chrome.storage.local.get(["todos"], (result) => {
        const todos = result.todos || [];
        const index = todos.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          todos[index] = todo;
          chrome.storage.local.set({ todos });
        }
      });
    });

    const deleteBtn = div.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      div.classList.add("fade-out");
      setTimeout(() => {
        div.remove();
        updateEmptyState();
        chrome.storage.local.get(["todos"], (result) => {
          const todos = result.todos || [];
          const filteredTodos = todos.filter((t) => t.id !== todo.id);
          chrome.storage.local.set({ todos: filteredTodos });
        });
      }, 300);
    });

    todoList.appendChild(div);
  }
});
