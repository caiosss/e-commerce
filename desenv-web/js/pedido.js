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

    
    alert("Compra confirmada!");
});
