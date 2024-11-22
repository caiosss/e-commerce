document.addEventListener("DOMContentLoaded", () => {
    const valorTotal = localStorage.getItem('total');
    if (valorTotal) {
        document.getElementById('total').value = `R$ ${valorTotal},00`;
    }
});

document.getElementById("paymentMethod").addEventListener("change", function() {
    const selectedMethod = this.value;
    const creditCardFields = document.getElementById("creditCardFields");
    const pixQRCode = document.getElementById("pixQRCode");

    if (selectedMethod === "cartao") {
        creditCardFields.style.display = "block";
        pixQRCode.style.display = "none";
    } else if (selectedMethod === "pix") {
        creditCardFields.style.display = "none";
        pixQRCode.style.display = "block";
    } else {
        creditCardFields.style.display = "none";
        pixQRCode.style.display = "none";
    }
});

document.getElementById("checkoutForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const clienteId = localStorage.getItem('id');
    const totalCompra = localStorage.getItem('total');
    const paymentMethod = document.getElementById('paymentMethod').value;
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));

    if(!totalCompra || !clienteId) {
        alert('Erro: Dados do cliente incorretos');
        return;
    }

    let pedidoData = {
        cliente_idcliente: clienteId,
        valor_total: totalCompra,
        metodo_pagamento: paymentMethod,
        produtos: carrinho,
    };

    if(paymentMethod === 'cartao') {
        pedidoData = {
            ...pedidoData,
            numero_cartao: document.getElementById('cardNumber').value,
            nome_cartao: document.getElementById('cardHolder').value,
            validade: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };
    }

    fetch('http://localhost:3000/api/pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pedidoData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.mensagem === 'Pedido criado com sucesso!') {
            alert('Pedido realizado com sucesso!');
            localStorage.removeItem('total');
            localStorage.removeItem('carrinho');
            window.location.href = './feedback.html';
        } else {
            alert('Erro ao realizar o pedido: ' + data.mensagem);
        }
    })
    .catch(error => console.log("Erro ao salvar ", error));
});
