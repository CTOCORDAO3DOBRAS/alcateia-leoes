const express  = require('express');
const router   = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET /api/missao/:dia — retorna a missão do dia
router.get('/:dia', async (req, res) => {
  try {
    const dia = parseInt(req.params.dia);
    if (isNaN(dia) || dia < 1 || dia > 90) {
      return res.status(400).json({ error: 'Dia inválido. Use um número entre 1 e 90.' });
    }

    const { data, error } = await supabase
      .from('alcateia_missoes')
      .select('*')
      .eq('dia', dia)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Missão não encontrada.' });

    res.json({ success: true, missao: data });
  } catch (err) {
    console.error('Erro em /api/missao:', err.message);
    res.status(500).json({ error: 'Erro ao buscar missão.' });
  }
});

// POST /api/missao/progresso — marca dia como concluído
router.post('/progresso', async (req, res) => {
  try {
    const { usuario_id, dia } = req.body;
    if (!usuario_id || !dia) {
      return res.status(400).json({ error: 'usuario_id e dia são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('alcateia_progresso')
      .upsert([{ usuario_id, dia, concluido: true, concluido_em: new Date().toISOString() }],
        { onConflict: 'usuario_id,dia' })
      .select('id, dia, concluido_em')
      .single();

    if (error) throw error;

    res.json({ success: true, progresso: data });
  } catch (err) {
    console.error('Erro em /api/missao/progresso:', err.message);
    res.status(500).json({ error: 'Erro ao salvar progresso.' });
  }
});

// GET /api/missao/progresso/:usuario_id — retorna dias concluídos
router.get('/progresso/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const { data, error } = await supabase
      .from('alcateia_progresso')
      .select('dia, concluido_em')
      .eq('usuario_id', usuario_id)
      .order('dia');

    if (error) throw error;

    const dias_concluidos = data.map(d => d.dia);
    const total = dias_concluidos.length;
    const proximo_dia = total < 90 ? (dias_concluidos[total - 1] || 0) + 1 : 90;

    res.json({
      success: true,
      dias_concluidos,
      total,
      proximo_dia,
      percentual: Math.round((total / 90) * 100)
    });
  } catch (err) {
    console.error('Erro em /api/missao/progresso:', err.message);
    res.status(500).json({ error: 'Erro ao buscar progresso.' });
  }
});

module.exports = router;
