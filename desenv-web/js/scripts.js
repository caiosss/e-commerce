import produto from "./produto.js";

const name = document.querySelectorAll(".name");
const price = document.querySelectorAll(".price");

produto.forEach((p, index) => {
    name[index].textContent = p.nome
    price[index].textContent = "R$" + p.preco 
});

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function addAoCarrinho(produtoIndex) {
    const item = produto[produtoIndex]
    carrinho.push(item)

    localStorage.setItem("carrinho", JSON.stringify(carrinho))
    atualizaContador();
}

function atualizaContador() {
    const contadorElemento = document.getElementById("cart-count")
    contadorElemento.textContent = carrinho.length;
}

document.querySelectorAll(".add-to-car").forEach((button, index) => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        addAoCarrinho(index);
    })
});

atualizaContador();


