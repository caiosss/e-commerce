import produto from "./produto.js";

const name = document.querySelectorAll(".name");
const price = document.querySelectorAll(".price");
const inputFilter = document.querySelector(".input-filter");
const productContainer = document.querySelector(".container-product")

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

document.querySelector('.filtro').addEventListener('click', () => {
  const filterValue = inputFilter.value.toLowerCase();
  const filteredProducts = produto.filter(p => p.nome.toLowerCase().includes(filterValue));

  productContainer.innerHTML = '';

  filteredProducts.forEach((p, index) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; border: 1px solid #ddd; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.2s;">
      <h2 class="name" style="font-size: 1.5rem; margin-bottom: 10px;">${p.nome}</h2>
      <p class="price" style="font-size: 1.2rem; color: #555; margin-bottom: 15px;">R$${p.preco}</p>
      <img style="height: 300px; width: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;" src="${p.imagem}" alt="${p.nome}" />
      <a class="btn btn-outline-dark mt-auto add-to-car" href="#" style="margin-bottom: 10px; width: 100%; text-align: center;">Add to cart</a>
      <a class="btn btn-outline-dark mt-auto btn-detalhes" data-index="${index}" href="./product-details.html" style="width: 100%; text-align: center;">Detalhes</a>
      </div>
    `;
    productContainer.appendChild(productElement);
  });
})

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

document.getElementById('logoutButton').addEventListener('click', logout);



