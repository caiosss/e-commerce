document.addEventListener("DOMContentLoaded", () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    function calcularTotal() {
        const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
        localStorage.setItem('total', total);
        cartTotalElement.textContent = total.toFixed(2);
    }

    function exibeProdutos() {
        carrinho.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <span class="item-nome">${item.nome}</span>
                <span class="item-preco">R$ ${item.preco.toFixed(2)}</span>               
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        calcularTotal(); 
    }
    exibeProdutos();
})