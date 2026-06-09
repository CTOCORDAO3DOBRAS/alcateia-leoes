const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

router.post('/', async (req, res) => {
  try {
    const {
      nome, email, whatsapp, cidade, estado,
      idade, estado_civil, filhos, ocupacao,
      perfil, score_papai, score_alianca, score_proposito,
      casado, respostas_texto, origem, senha
    } = req.body;

    if (!nome || !nome.trim()) return res.status(400).json({ error: 'Nome é obrigatório.' });
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email inválido.' });

    const { data: existente } = await supabase
      .from('alcateia_usuarios')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existente) return res.status(409).json({ error: 'Este email já está cadastrado.', code: 'EMAIL_DUPLICADO' });

    let senha_hash = null;
    if (senha && senha.length >= 6) senha_hash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from('alcateia_usuarios')
      .insert([{
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        whatsapp: whatsapp || null,
        cidade: cidade || null,
        estado: estado || null,
        idade: idade || null,
        estado_civil: estado_civil || null,
        filhos: filhos || null,
        ocupacao: ocupacao || null,
        perfil: perfil || null,
        score_papai: score_papai || null,
        score_alianca: score_alianca || null,
        score_proposito: score_proposito || null,
        casado: casado || false,
        respostas_texto: respostas_texto || {},
        origem: origem || null,
        senha_hash,
        trial_inicio: new Date().toISOString(),
        trial_ativo: true,
        assinante: false
      }])
      .select('id, nome, email, perfil, trial_inicio')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      leao: { id: data.id, nome: data.nome, perfil: data.perfil, trial_inicio: data.trial_inicio }
    });

  } catch (err) {
    console.error('Erro no cadastro:', err.message);
    res.status(500).json({ error: 'Erro interno ao salvar cadastro.' });
  }
});

module.exports = router;
