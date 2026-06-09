const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

global.WebSocket = require('ws');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.use('/api/cadastro', require('./routes/cadastro'));
app.use('/api/plano',    require('./routes/plano'));
app.use('/api/login',    require('./routes/login'));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Alcateia de Leões rodando em http://localhost:${PORT}`);
});
