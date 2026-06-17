const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const propiedadesRouter = require('./routes/propiedades');

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/propiedades', propiedadesRouter);

// Tratamento de rota 404 (Boa prática)
app.use((req, res, next) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

// Tratamento de Erros
app.use((err, req, res, next) => {
    console.error("❌ Erro no Servidor:", err.stack);
    res.status(500).json({ error: "Erro interno do servidor", details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));