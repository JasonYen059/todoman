const todoWrapper = document.querySelector(".todo-wrapper");
const addInput = document.querySelector(".create .text");
const addBtn = document.querySelector(".create .add");
const logoutBtn = document.querySelector(".logout");

let tempList = [];

const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}
const token = getCookie('token');

const setList = (data) => {
  tempList = data;
  todoWrapper.innerHTML = "";
  tempList.forEach((todo) => {
    const div = document.createElement("div");
    div.classList = "todo-list item";

    const text = document.createElement("div");
    text.classList = "list";
    text.innerText = todo.item;

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList = "check";
    checkbox.checked = todo.check;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList = "delete handler";

    div.appendChild(checkbox);
    div.appendChild(text);
    div.appendChild(deleteBtn);
    todoWrapper.appendChild(div);

    deleteBtn.addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    checkbox.addEventListener("change", (e) => {
      let selected = tempList.find((temp) => temp.id == todo.id);
      selected.check = e.target.checked;
      updateList(selected);
    });
  });
};

const createTodo = async () => {
  const item = addInput.value;
  if (!item) {
    alert("Type something, Bitch");
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/api/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ item }),
    });
    const todolist = await res.json();
    addInput.value = "";
    setList(todolist);
  } catch (error) {
    console.log(error);
  }
};

const updateList = async (updateData) => {
  const { id, item, check } = updateData;
  try {
    const res = await fetch(`http://localhost:3000/api/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ item, check }),
    });
    const todolist = await res.json();
    setList(todolist);
  } catch (error) {
    console.log(error);
  }
};

const deleteTodo = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/todo/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const todolist = await res.json();
    setList(todolist);
  } catch (error) {
    console.log(error);
  }
};

const getTodos = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/todo",{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const todolist = await res.json();
    setList(todolist);
    console.log(todolist);
  } catch (error) {
    console.log(error);
  }
};

getTodos();

addBtn.addEventListener("click", () => {
  createTodo();
});

logoutBtn.addEventListener("click", ()=>{
  deleteCookie('token');
  window.location.href = '/';
})
