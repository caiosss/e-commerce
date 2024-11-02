document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if(response.ok){
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.usuario.nome);
            alert('Login bem-sucedido!');

            window.location.href = './index.html';
        } else {
            alert(data.mensagem);
        }
    } catch(error) {
        console.log('Erro ao fazer login: ', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
});