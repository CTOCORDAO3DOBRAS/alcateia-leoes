const express  = require('express');
const router   = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    const { data: usuario, error } = await supabase
      .from('alcateia_usuarios')
      .select('id, nome, perfil, score_papai, score_alianca, score_proposito, trial_inicio, trial_ativo, assinante')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

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
      usuario: {
        nome:            usuario.nome,
        perfil:          usuario.perfil,
        score_papai:     usuario.score_papai,
        score_alianca:   usuario.score_alianca,
        score_proposito: usuario.score_proposito
      },
      acesso: {
        status:         statusAcesso,
        dias_restantes: diasRestantes,
        pode_acessar:   statusAcesso !== 'trial_expirado'
      }
    });

  } catch (err) {
    console.error('Erro em /api/plano:', err.message);
    res.status(500).json({ error: 'Erro ao buscar plano.' });
  }
});

router.post('/confirmar-assinatura', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) return res.status(401).json({ error: 'Não autorizado.' });

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email obrigatório.' });

    const { data, error } = await supabase
      .from('alcateia_usuarios')
      .update({ assinante: true, trial_ativo: true, atualizado_em: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim())
      .select('id, nome, email')
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Usuário não encontrado.' });

    console.log(`Assinatura confirmada: ${data.nome} (${data.email})`);
    res.json({ success: true, leao: data.nome });

  } catch (err) {
    console.error('Erro ao confirmar assinatura:', err.message);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
