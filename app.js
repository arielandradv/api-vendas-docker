const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

app.use(express.json());

// Conexão com o MongoDB usando a variável de ambiente definida no docker-compose
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/vendasDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB!'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Produto
const Produto = mongoose.model('Produto', {
  nome: String,
  preco: Number,
  quantidade: Number
});

// Cadastrar produto (POST /item)
app.post('/item', async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.save();
    res.status(201).json({ message: "Produto cadastrado com sucesso!", produto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos os produtos (GET /itens)
app.get('/itens', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar um produto específico por ID (GET /item/:id)
app.get('/item/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ message: "Produto não encontrado" });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});