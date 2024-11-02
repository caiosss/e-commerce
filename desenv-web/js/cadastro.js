document.getElementById("cadastroForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        if(response.ok) {
            const data = await response.json();
            alert(data.mensagem);
        } else {
            const errorData = await response.json();
            alert("Erro: ", errorData.mensagem);
        }
    } catch (error) {
        alert("Erro ao conectar na API");
        console.log("Error: ", error);
    }
} )