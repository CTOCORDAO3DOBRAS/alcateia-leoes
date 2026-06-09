const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Compatibilidade do Supabase com Node 18 (WebSocket nativo ausente)
global.WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Rotas
app.use('/api/cadastro', require('./routes/cadastro'));
app.use('/api/plano',    require('./routes/plano'));

// Fallback — serve o index.html para qualquer rota
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Alcateia de Leões rodando em http://localhost:${PORT}`);
});
