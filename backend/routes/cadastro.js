const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/cadastro
router.post('/', async (req, res) => {
  try {
    const {
      nome, email, whatsapp, cidade, estado,
      idade, estado_civil, filhos, ocupacao,
      perfil, score_papai, score_alianca, score_proposito,
      casado, respostas_texto, origem
    } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('alcateia_usuarios')
      .insert([{
        nome,
        email,
        whatsapp,
        cidade,
        estado,
        idade,
        estado_civil,
        filhos,
        ocupacao,
        perfil,
        score_papai,
        score_alianca,
        score_proposito,
        casado,
        respostas_texto,
        origem,
        trial_inicio: new Date().toISOString(),
        trial_ativo: true,
        assinante: false
      }]);

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ error: 'Erro ao salvar cadastro.' });
  }
});

module.exports = router;
