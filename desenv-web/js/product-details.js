const produtos = [
    { nome: "Camiseta", preco: 50.00, descricao: "Camiseta confortável e estilosa.", imagem: "./images/camiseta.png" },
    { nome: "Tênis", preco: 180.00, descricao: "Tênis esportivo para o dia a dia.", imagem: "./images/tenis.png" },
    { nome: "Calça Jeans", preco: 120.00, descricao: "Calça jeans de alta qualidade.", imagem: "./images/calça.png" },
    { nome: "Roupão", preco: 200.00, descricao: "Roupão confortável para todas as estações.", imagem: "./images/conjunto.png" },
    { nome: "Boné", preco: 40.00, descricao: "Boné estiloso para proteção solar.", imagem: "./images/bone.png" },
    { nome: "Vestido", preco: 150.00, descricao: "Vestido elegante para todas as ocasiões.", imagem: "./images/vestido.png" },
    { nome: "Moletom", preco: 150.00, descricao: "Moletom quente e confortável.", imagem: "./images/jaqueta.png" },
    { nome: "Short Jeans", preco: 150.00, descricao: "Short jeans despojado e confortável.", imagem: "./images/short-jeans.png" },
];

const productIndex = localStorage.getItem("selectedProductIndex");

const produto = produtos[productIndex];

document.getElementById("product-name").innerText = produto.nome;
document.getElementById("product-price").innerText = `R$ ${produto.preco.toFixed(2)}`;
document.getElementById("product-description").innerText = produto.descricao;
document.getElementById("product-image").src = produto.imagem;