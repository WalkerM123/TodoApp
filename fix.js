const addBtn = document.getElementById("addBtn");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const pagination = document.getElementById("pagination");

const todos = [];
const itemsPerPage = 3;
let currentPage = 1;

// Thêm sự kiện Enter để thêm công việc
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

addBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  if (task === "") {
    showErrorMessage("Vui lòng nhập công việc.");
    return;
  }

  todos.unshift(task);
  todoInput.value = "";
  currentPage = 1;
  renderTodos();
  renderPagination();
});

function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "Chưa có công việc nào. Hãy thêm công việc mới!";
    todoList.appendChild(emptyState);
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentTodos = todos.slice(start, end);

  currentTodos.forEach((task, index) => {
    const actualIndex = start + index;
    const li = document.createElement("li");
    li.className = "todo-item";

    const taskText = document.createElement("span");
    taskText.className = "todo-text";
    taskText.textContent = task;

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Sửa";
    editBtn.addEventListener("click", () => {
      editTask(actualIndex, li);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Xóa";
    deleteBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn xóa công việc này?")) {
        deleteTask(actualIndex);
      }
    });

    li.appendChild(taskText);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

function renderPagination() {
  pagination.innerHTML = "";

  const totalPages = Math.ceil(todos.length / itemsPerPage);

  if (totalPages <= 1) {
    return;
  }

  // Nút Previous
  const prevBtn = document.createElement("button");
  prevBtn.className = "pagination-btn";
  prevBtn.textContent = "« Trước";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTodos();
      renderPagination();
    }
  });
  pagination.appendChild(prevBtn);

  // Các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "pagination-btn";
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTodos();
      renderPagination();
    });
    pagination.appendChild(btn);
  }

  // Nút Next
  const nextBtn = document.createElement("button");
  nextBtn.className = "pagination-btn";
  nextBtn.textContent = "Sau »";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTodos();
      renderPagination();
    }
  });
  pagination.appendChild(nextBtn);
}

function editTask(index, li) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = todos[index];
  input.className = "todo-text";

  const saveBtn = document.createElement("button");
  saveBtn.className = "save-btn";
  saveBtn.textContent = "Lưu";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel-btn";
  cancelBtn.textContent = "Hủy";

  li.innerHTML = "";
  li.appendChild(input);
  li.appendChild(saveBtn);
  li.appendChild(cancelBtn);

  input.focus();
  input.select();

  // Lưu khi nhấn Enter
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveBtn.click();
    }
  });

  saveBtn.addEventListener("click", () => {
    const updatedTask = input.value.trim();
    if (updatedTask === "") {
      showErrorMessage("Công việc không được để trống.");
      return;
    }
    if (updatedTask === todos[index]) {
      renderTodos();
      return;
    }
    todos[index] = updatedTask;
    renderTodos();
  });

  cancelBtn.addEventListener("click", () => {
    renderTodos();
  });
}

function deleteTask(index) {
  todos.splice(index, 1);

  // Điều chỉnh trang hiện tại nếu cần
  const totalPages = Math.ceil(todos.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  if (todos.length === 0) {
    currentPage = 1;
  }

  renderTodos();
  renderPagination();
}

function showErrorMessage(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);
}

// Khởi tạo hiển thị ban đầu
renderTodos();
renderPagination();
