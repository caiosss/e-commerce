import produto from "./produto.js"

const name = document.querySelectorAll(".name")
const price = document.querySelectorAll(".price")

produto.forEach((p, index) => {
    name[index].textContent = p.nome
    price[index].textContent = "R$" + p.preco 
})

