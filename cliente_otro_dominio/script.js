window.onload = () => {
    fetchBooks();

    document.querySelector('#loginButton').addEventListener('click', login);
    document.querySelector('#logoutButton').addEventListener('click', logout);
    document.querySelector('#createButton').addEventListener('click', createBook);

    checkAuthStatus(); // Verificar si el usuario está autenticado al cargar la página
};

function checkAuthStatus() {
    let token = localStorage.getItem("jwt");

    if (token) {
        document.querySelector("#login-form").style.display = "none";
        document.querySelector("#logoutButton").style.display = "block";
    } else {
        document.querySelector("#login-form").style.display = "block";
        document.querySelector("#logoutButton").style.display = "none";
    }
}

async function login() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    let response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    let data = await response.json();

    if (data.token) {
        localStorage.setItem("jwt", data.token);
        checkAuthStatus();
        fetchBooks();
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

function logout() {
    localStorage.removeItem("jwt");
    checkAuthStatus();
    fetchBooks();
}

async function fetchBooks() {
    let res = await fetch("http://localhost:5000/api/books");
    let books = await res.json();
    updateTable(books);
}

function updateTable(books) {
    let table = document.getElementById("book-table");
    table.innerHTML = ""; 

    let token = localStorage.getItem("jwt");

    books.forEach(book => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.id}</td>
            <td contenteditable="${token ? "true" : "false"}">${book.title}</td>
            <td contenteditable="${token ? "true" : "false"}">${book.author}</td>
            <td contenteditable="${token ? "true" : "false"}">${book.year}</td>
            <td>
                ${token ? `<button onclick="editBook(${book.id}, this)">Modificar</button>` : ""}
                ${token ? `<button onclick="deleteBook(${book.id})">Eliminar</button>` : ""}
            </td>
        `;
        table.appendChild(row);
    });

    // Deshabilitar el botón de "Añadir Libro" si no hay un token
    document.querySelector("#createButton").disabled = !token;
}

async function createBook() {
    let token = localStorage.getItem("jwt");
    if (!token) {
        alert("Debes iniciar sesión para añadir un libro.");
        return;
    }

    let title = document.querySelector("#book-title").value;
    let author = document.querySelector("#book-author").value;
    let year = document.querySelector("#book-year").value;

    let response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, author, year })
    });

    if (response.ok) {
        fetchBooks();
    } else {
        alert("Acceso no autorizado");
    }
}

async function deleteBook(id) {
    let token = localStorage.getItem("jwt");
    if (!token) {
        alert("No tienes permisos para eliminar libros.");
        return;
    }

    let response = await fetch("http://localhost:5000/api/books", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
    });

    if (response.ok) {
        fetchBooks();
    } else {
        alert("Acceso no autorizado");
    }
}

async function editBook(id, button) {
    let token = localStorage.getItem("jwt");
    if (!token) {
        alert("No tienes permisos para modificar libros.");
        return;
    }

    let row = button.parentElement.parentElement;
    let title = row.children[1].innerText;
    let author = row.children[2].innerText;
    let year = row.children[3].innerText;

    let response = await fetch("http://localhost:5000/api/books", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, title, author, year })
    });

    if (response.ok) {
        fetchBooks();
    } else {
        alert("Acceso no autorizado");
    }
}

window.editBook = editBook;
window.deleteBook = deleteBook;
