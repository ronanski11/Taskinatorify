document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("new-todo");
  const deadlineInput = document.getElementById("todo-deadline");
  const todoList = document.getElementById("todo-list");
  const historyList = document.getElementById("history-list");
  const addButton = document.querySelector(".add-btn");
  const viewButtons = document.querySelectorAll(".view-btn");
  const views = document.querySelectorAll(".view");
  const sortFilter = document.getElementById("sort-filter");
  const statusFilter = document.getElementById("status-filter");
  const historyDateFilter = document.getElementById("history-date-filter");
  const historyTypeFilter = document.getElementById("history-type-filter");

  // Set minimum date and default value for deadline to now
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const nowString = now.toISOString().slice(0, 16);
  deadlineInput.min = nowString;
  deadlineInput.value = nowString;

  // Initialize views
  function initializeViews() {
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetView = btn.dataset.view;
        viewButtons.forEach((b) => b.classList.remove("active"));
        views.forEach((v) => v.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`${targetView}-view`).classList.add("active");
      });
    });
  }

  // Update empty states
  function updateEmptyState(view) {
    const list = view === "tasks" ? todoList : historyList;
    const emptyState = list.parentElement.querySelector(".empty-state");
    if (list.children.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }
  }

  // Load and render todos
  async function loadTodos() {
    const result = await chrome.storage.local.get(["todos"]);
    const todos = result.todos || [];
    renderTodos(todos);
  }

  // Load and render history
  async function loadHistory() {
    const result = await chrome.storage.local.get(["history"]);
    const history = result.history || [];
    renderHistory(history);
  }

  // Add new todo
  async function addNewTodo() {
    const text = todoInput.value.trim();
    const deadline = deadlineInput.value;

    if (text) {
      const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        dateAdded: new Date().toISOString(),
        deadline: deadline || null,
      };

      const result = await chrome.storage.local.get(["todos", "history"]);
      const todos = result.todos || [];
      const history = result.history || [];

      todos.push(newTodo);
      history.push({
        type: "added",
        todoId: newTodo.id,
        text: newTodo.text,
        date: new Date().toISOString(),
      });

      await chrome.storage.local.set({ todos, history });
      renderTodos(todos);
      renderHistory(history);

      todoInput.value = "";
      // Reset deadline to current time
      const newNow = new Date();
      newNow.setMinutes(newNow.getMinutes() - newNow.getTimezoneOffset());
      deadlineInput.value = newNow.toISOString().slice(0, 16);
    }
  }

  // Filter and sort todos
  function filterAndSortTodos(todos) {
    const status = statusFilter.value;
    const sort = sortFilter.value;
    const now = new Date();

    // Filter
    let filtered = todos.filter((todo) => {
      switch (status) {
        case "active":
          return !todo.completed;
        case "completed":
          return todo.completed;
        case "upcoming":
          return (
            !todo.completed && todo.deadline && new Date(todo.deadline) > now
          );
        case "overdue":
          return (
            !todo.completed && todo.deadline && new Date(todo.deadline) < now
          );
        default:
          return true;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case "deadline":
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        case "added":
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case "name":
          return a.text.localeCompare(b.text);
        default:
          return 0;
      }
    });

    return filtered;
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      new Date(now.setDate(now.getDate() + 1)).toDateString() ===
      date.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  // Render todos
  function renderTodos(todos) {
    const filtered = filterAndSortTodos(todos);
    todoList.innerHTML = "";

    filtered.forEach((todo) => {
      const div = document.createElement("div");
      div.className = `todo-item ${todo.completed ? "completed" : ""} ${
        !todo.completed && todo.deadline && new Date(todo.deadline) < new Date()
          ? "overdue"
          : ""
      }`;

      div.innerHTML = `
        <div class="checkbox-wrapper">
          <input type="checkbox" class="custom-checkbox" ${
            todo.completed ? "checked" : ""
          }>
        </div>
        <div class="todo-content">
          <div class="todo-text">${todo.text}</div>
          <div class="todo-meta">
            <span class="date-added">Added ${formatDate(todo.dateAdded)}</span>
            ${
              todo.deadline
                ? `<span class="deadline">Due ${formatDate(
                    todo.deadline
                  )}</span>`
                : ""
            }
          </div>
        </div>
        <button class="delete-btn">
          <i class="fas fa-trash-alt"></i>
        </button>
      `;

      const checkbox = div.querySelector(".custom-checkbox");
      checkbox.addEventListener("change", async () => {
        todo.completed = checkbox.checked;
        div.classList.toggle("completed");

        const result = await chrome.storage.local.get(["todos", "history"]);
        const todos = result.todos || [];
        const history = result.history || [];

        const index = todos.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          todos[index] = todo;

          history.push({
            type: "completed",
            todoId: todo.id,
            text: todo.text,
            date: new Date().toISOString(),
          });

          await chrome.storage.local.set({ todos, history });
          renderHistory(history);
        }
      });

      const deleteBtn = div.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async () => {
        div.classList.add("fade-out");

        setTimeout(async () => {
          const result = await chrome.storage.local.get(["todos", "history"]);
          const todos = result.todos || [];
          const history = result.history || [];

          const filteredTodos = todos.filter((t) => t.id !== todo.id);
          history.push({
            type: "deleted",
            todoId: todo.id,
            text: todo.text,
            date: new Date().toISOString(),
          });

          await chrome.storage.local.set({ todos: filteredTodos, history });
          renderTodos(filteredTodos);
          renderHistory(history);
        }, 300);
      });

      todoList.appendChild(div);
    });

    updateEmptyState("tasks");
  }

  // Filter history
  function filterHistory(history) {
    const type = historyTypeFilter.value;
    const date = historyDateFilter.value;

    return history.filter((item) => {
      const matchesType = type === "all" || item.type === type;
      const matchesDate =
        !date ||
        new Date(item.date).toDateString() === new Date(date).toDateString();
      return matchesType && matchesDate;
    });
  }

  // Render history
  function renderHistory(history) {
    const filtered = filterHistory(history);
    historyList.innerHTML = "";

    filtered.forEach((item) => {
      const div = document.createElement("div");
      div.className = "history-item";

      const actionText = {
        added: "Added task",
        completed: "Completed task",
        deleted: "Deleted task",
      };

      div.innerHTML = `
        <div class="history-icon ${item.type}">
          <i class="fas fa-${
            item.type === "added"
              ? "plus"
              : item.type === "completed"
              ? "check"
              : "trash-alt"
          }"></i>
        </div>
        <div class="history-content">
          <div class="history-text">${actionText[item.type]}: ${item.text}</div>
          <div class="history-date">${formatDate(item.date)}</div>
        </div>
      `;

      historyList.appendChild(div);
    });

    updateEmptyState("history");
  }

  // Initialize event listeners
  addButton.addEventListener("click", addNewTodo);

  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addNewTodo();
    }
  });

  sortFilter.addEventListener("change", loadTodos);
  statusFilter.addEventListener("change", loadTodos);
  historyDateFilter.addEventListener("change", loadHistory);
  historyTypeFilter.addEventListener("change", loadHistory);

  // Initialize
  initializeViews();
  loadTodos();
  loadHistory();
});
