import express from 'express'

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

app.use(express.json());

app.get('/api', (res)=> {
    res.send('Estou rodando local!')
});

app.post('/api/cadastro', (req,res) => {
    const { nome, email, senha } = req.body;

    if(!nome || !email || !senha) {
        return res.status(400).json({mensagem: 'Por favor forneça email, senha ou nome'});
    }

    res.status(201).json({mensagem: "Usuário criado com sucesso!", usuario: {nome, email}})
});
