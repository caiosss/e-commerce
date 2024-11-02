import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //POR A SENHA DE VOCES
    database: 'ecommerce'
});

db.connect((err) => {
    if(err) {
        console.log('Erro ao conectar ao MySQL: ', err);
        return; 
    }
    console.log("Conectado ao MySQL");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


app.get('/api', (res)=> {
    res.send('Estou rodando local!');
});

app.post('/api/cadastro', async (req,res) => {
    const { nome, email, senha } = req.body;

    if(!nome || !email || !senha) {
        return res.status(400).json({mensagem: 'Por favor forneça email, senha ou nome'});
    }

    db.query('SELECT * FROM cliente WHERE email = ?', [email], async(err, result) => {
        if (err) return res.status(500).json({mensagem: 'Erro ao verificar email', error: err});

        if( result.length > 0) {
            return res.json(400).json({mensagem: 'Email já cadastrado.'});
        }

        const hashPassword = await bcrypt.hash(senha, 10);

        const query = 'INSERT INTO cliente (nome, email, senha) VALUES(?,?,?)';
        
        db.query(query, [nome,email, hashPassword], (err, result) => {
            if(err) {
                return res.status(500).json({mensagem: 'Erro ao cadastrar cliente', error: err});
            }
            res.status(201).json({mensagem: "Usuário criado com sucesso!", usuario: {nome, email}})
        });
    });
});

app.post('/api/login', async (req,res) => {
    const { email, senha } = req.body;

    if(!email || !senha) {
        return res.status(400).json({ mensagem: 'Por favor, forneça email e senha!' });
    }

    db.query('SELECT * FROM cliente WHERE email = ?', [email], async (err, result) => {
        if(err) return res.status(500).json({ mensagem: 'Erro ao verificar o cliente', error: err});

        if (result.length === 0) {
            return res.status(401).json({mensagem: 'Email ou senha inválidos!'});
        }

        const cliente = result[0];

        const match = await bcrypt.compare(senha, cliente.senha);
        if(!match) {
            return res.status(401).json({mensagem: 'Email ou senha inválidos!'});
        }

        const token = jwt.sign({id: cliente.id, nome: cliente.nome, email: cliente.email}, 'token_cliente', {
            expiresIn: '1h'
        });

        res.json({ 
            token,
            usuario: {
                nome: cliente.nome
            }
         });

    });
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'token_cliente', (err, cliente) => {
        if(err) return res.sendStatus(403);
        req.user = cliente
        next();
    });
}

app.get('/api/protegida', authenticateToken, (req, res) => {
    res.json({ mensagem: 'Rota protegida', user: req.user });
});
