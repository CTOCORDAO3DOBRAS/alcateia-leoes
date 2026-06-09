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
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

    const { data: usuario, error } = await supabase
      .from('alcateia_usuarios')
      .select('id, nome, email, perfil, senha_hash, trial_inicio, trial_ativo, assinante')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw error;
    if (!usuario) return res.status(401).json({ error: 'Email ou senha incorretos.' });
    if (!usuario.senha_hash) return res.status(401).json({ error: 'Conta sem senha definida. Refaça o cadastro.' });

    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaOk) return res.status(401).json({ error: 'Email ou senha incorretos.' });

    const agora         = new Date();
    const trialInicio   = new Date(usuario.trial_inicio);
    const diasNoTrial   = Math.floor((agora - trialInicio) / (1000 * 60 * 60 * 24));
    const diasRestantes = Math.max(0, 7 - diasNoTrial);
    const trialExpirado = diasNoTrial >= 7 && !usuario.assinante;

    let statusAcesso;
    if (usuario.assinante)   statusAcesso = 'assinante';
    else if (!trialExpirado) statusAcesso = 'trial_ativo';
    else                     statusAcesso = 'trial_expirado';

    res.json({
      success: true,
      leao: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
      acesso: { status: statusAcesso, dias_restantes: diasRestantes, pode_acessar: statusAcesso !== 'trial_expirado' }
    });

  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
