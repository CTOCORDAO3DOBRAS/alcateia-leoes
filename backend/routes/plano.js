const express = require('express');
const router  = express.Router();

router.get('/:perfil', (req, res) => {
  const perfil = req.params.perfil;
  const perfisValidos = ['adormecido', 'desperto', 'caminhante', 'edificador'];
  if (!perfisValidos.includes(perfil)) {
    return res.status(400).json({ error: 'Perfil inválido.' });
  }
  res.json({ success: true, perfil });
});

module.exports = router;
