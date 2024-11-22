import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

export default app;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CaioDavi@1726', //POR A SENHA DE VOCES
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

        const token = jwt.sign({id: cliente.idcliente, nome: cliente.nome, email: cliente.email}, 'token_cliente', {
            expiresIn: '1h'
        });

        res.json({ 
            token,
            usuario: {
                nome: cliente.nome,
                id: cliente.idcliente,
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

app.post('/api/pedido', (req,res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token) {
            return res.status(401).json({mensagem: 'Acesso negado'});
        }

        const user = jwt.verify(token, 'token_cliente');

        if (!user.id) {
            return res.status(400).json({ mensagem: 'ID de cliente não encontrado no token!' });
        }

        const { produtos, valor_total, metodo_pagamento } = req.body;

        if (!produtos || produtos.length === 0) {
            return res.status(400).json({ mensagem: 'Nenhum produto no pedido!' });
        }

        if (!valor_total || !metodo_pagamento) {
            return res.status(400).json({ mensagem: 'Dados incompletos! Por favor, envie o valor e o método de pagamento.' });
        }

        const dataPedido = new Date();

        const queryPedido = `INSERT INTO pedido(cliente_idcliente, data_pedido) VALUES(?,?)`;
        db.query(queryPedido, [user.id, dataPedido], (err, result) => {
            if (err) {
                return res.status(500).json({ mensagem: 'Erro ao criar pedido', erro: err });
            }

            // Obtém o ID do pedido criado
            const id_pedido = result.insertId;

            // Converte o array de produtos para JSON string
            const produtosJSON = JSON.stringify(produtos);

            // Insere os itens do pedido na tabela `itens_pedido`
            const queryItensPedido = `INSERT INTO itens_pedido (id_pedido, produtos) VALUES (?, ?)`;

            db.query(queryItensPedido, [id_pedido, produtosJSON], (err, result) => {
                if (err) {
                    return res.status(500).json({ mensagem: 'Erro ao inserir itens do pedido', erro: err });
                }

                res.status(201).json({
                    mensagem: 'Pedido criado com sucesso!',
                    pedido: {
                        idpedido: id_pedido,
                        produtos: produtos,
                        metodo_pagamento,
                        valor_total,
                        data_pedido: dataPedido
                    }
                });
            });
        });
    } catch (err) {
        console.error('Erro ao processar pedido:', err);
        res.status(500).json({ mensagem: 'Erro interno no servidor', erro: err.message });
    }
});

app.post('/api/feedback', (req, res) => {
    const { comentario, avaliacao_estrelas } = req.body;

    // if (!comentario || !avaliacao_estrelas) {
    //     return res.status(400).json({ mensagem: 'Por favor, forneça comentário e avaliação em estrelas!' });
    // }

    const query = 'INSERT INTO feedback (comentario, avaliacao_estrelas) VALUES (?, ?)';

    db.query(query, [comentario, avaliacao_estrelas], (err, result) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao inserir feedback', erro: err });
        }

        res.status(201).json({ mensagem: 'Feedback enviado com sucesso!', feedback: { comentario, avaliacao_estrelas } });
    });
});
