import produto from "./produto.js";

const name = document.querySelectorAll(".name");
const price = document.querySelectorAll(".price");


produto.forEach((p, index) => {
    name[index].textContent = p.nome;
    price[index].textContent = "R$" + p.preco;
});

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function addAoCarrinho(produtoIndex) {
    const item = produto[produtoIndex];
    carrinho.push(item);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizaContador();
}

function atualizaContador() {
    const contadorElemento = document.getElementById("cart-count");
    contadorElemento.textContent = carrinho.length;
}

document.querySelectorAll(".add-to-car").forEach((button, index) => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        addAoCarrinho(index);
    });
});

document.querySelectorAll(".btn-detalhes").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const productIndex = button.getAttribute("data-index");
        localStorage.setItem("selectedProductIndex", productIndex);
        window.location.href = "./product-details.html";
    });
});

atualizaContador();

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('username');
    const userDisplay = document.getElementById('nome-usuario');

    if(userName) {
        userDisplay.textContent = `Olá, ${userName}!`;
    } else {
        userDisplay.textContent = `Olá, visitante!`;
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

document.getElementById('logoutButton').addEventListener('click', logout);



