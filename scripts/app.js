/* ══════════════════════════════════════════
   ALCATEIA DE LEÕES — app.js
   Lógica: navegação, diagnóstico, perfis, plano
══════════════════════════════════════════ */

var U = { nome: '', perfil: '', scores: null };
var escores = {};
var bifEstado = null;

/* ──────────────────────────────
   PERFIS — Da Morte Para a Vida
────────────────────────────── */
var PERFIS = {
  adormecido: {
    badge: 'O Adormecido',
    badgeStyle: 'background:rgba(192,57,43,0.2);color:#e74c3c;border:0.5px solid rgba(192,57,43,0.4)',
    tagline: 'Vive no automático. Algo está começando a acordar — e o fato de você estar aqui já é o primeiro sinal.',
    desc: 'Você sabe que existe algo maior dentro de si, mas o medo e o conforto têm sido mais fortes. Ainda não fez a pergunta certa sobre si mesmo. É o homem do quarto ao lado antes da primeira internação.',
    perigo: 'Perigo: continuar no automático até que a circunstância force a mudança — como o homem do quarto ao lado.',
    passos: [
      'Faça a pergunta-âncora todos os dias ao acordar: "O que estou fazendo hoje me leva ao meu propósito?"',
      'Identifique uma pessoa de confiança para compartilhar o que descobriu neste diagnóstico.',
      'Leia o livro Da Morte Para a Vida e conheça histórias de pessoas que estiveram onde você está.',
      'Comece um diário de gratidão — 3 coisas por dia. Isso recalibra a perspectiva.'
    ],
    fases: [
      {
        periodo: 'Dias 1–30', nome: 'Identidade — antes de qualquer coisa',
        verso: '"Antes de te formar no ventre materno, Eu te conheci." — Jr 1:5',
        passos: [
          { n: 'Passo 1', t: 'A pergunta âncora diária', d: 'Todo dia, ao acordar: O que estou fazendo hoje me leva ao meu propósito?', m: ['Todo dia', 'Sim ou Não'] },
          { n: 'Passo 2', t: 'Documente seu momento de ruptura', d: 'Escreva o que te trouxe aqui. Essa memória é sua bússola nos dias difíceis.', m: ['Semana 1', '1 página escrita'] }
        ]
      },
      {
        periodo: 'Dias 31–60', nome: 'Conexão — 30 minutos com O PAPAI',
        verso: '"Buscai o reino de Deus em primeiro lugar." — Mt 6:33',
        passos: [
          { n: 'Passo 3', t: 'Tenda do Encontro', d: '30 minutos diários com O PAPAI — antes do celular, antes do trabalho.', m: ['Diário', 'Antes das 7h'] },
          { n: 'Passo 4', t: 'Identifique uma associação desalinhada', d: 'Uma relação ou hábito que te mantém no automático. Planeje o rompimento pacífico.', m: ['Semana 5', '1 decisão concreta'] }
        ]
      },
      {
        periodo: 'Dias 61–90', nome: 'Movimento — o primeiro passo real',
        verso: '"Levanta-te, pois, e vai." — At 22:10',
        passos: [
          { n: 'Passo 5', t: 'Conecte-se à Alcateia', d: 'Encontre outros em jornada. O leão solitário é o mais vulnerável.', m: ['Semana 9', '1 conexão real'] },
          { n: 'Passo 6', t: 'Dê um passo concreto', d: 'UMA ação que você vem adiando, ligada ao seu propósito. Faça agora.', m: ['Dia 90', '1 ação documentada'] }
        ]
      }
    ]
  },

  desperto: {
    badge: 'O Desperto',
    badgeStyle: 'background:rgba(201,168,76,0.15);color:#c9a84c;border:0.5px solid rgba(201,168,76,0.4)',
    tagline: 'Já teve o momento de ruptura. Está entre o casulo e o voo — a posição mais corajosa de todas.',
    desc: 'Sabe que precisa mudar, mas ainda não tem direção clara. O Desperto que age rapidamente tem o maior potencial de transformação acelerada.',
    perigo: 'Oportunidade: o Desperto que age rapidamente tem o maior potencial de transformação acelerada.',
    passos: [
      'Documente seu momento de ruptura por escrito. Essa memória é sua bússola nos dias difíceis.',
      'Reserve 30 minutos diários com O PAPAI — antes do celular, antes do trabalho.',
      'Identifique uma associação desalinhada que precisa de rompimento pacífico.',
      'Conecte-se à Alcateia de Leões para encontrar outros Despertos na jornada.'
    ],
    fases: [
      {
        periodo: 'Dias 1–30', nome: 'Fundação — estrutura sacerdotal no lar',
        verso: '"Quanto a mim e à minha família, serviremos ao SENHOR." — Js 24:15',
        passos: [
          { n: 'Passo 1', t: 'Sacerdote do lar', d: 'Abrir a semana com palavra, oração e bênção sobre a família. Toda segunda-feira.', m: ['Toda segunda', '4 semanas'] },
          { n: 'Passo 2', t: 'Tenda do Encontro', d: 'Espaço físico e temporal fixo de adoração diária. Não religião — necessidade.', m: ['Diário', 'Mesmo horário'] }
        ]
      },
      {
        periodo: 'Dias 31–60', nome: 'Consolidação — prosperidade nas 5 áreas',
        verso: '"A bênção do SENHOR enriquece e não traz tristeza." — Pv 10:22',
        passos: [
          { n: 'Passo 3', t: 'Prosperidade nas 5 dimensões', d: 'Espiritual · Relacional · Física · Mental · Financeira. Uma ação por dimensão por semana.', m: ['Semanal', '5 áreas'] },
          { n: 'Passo 4', t: 'Rompimento pacífico', d: 'Estruture a saída de uma associação desalinhada na sua vida.', m: ['Semanas 5–6', '1 decisão'] }
        ]
      },
      {
        periodo: 'Dias 61–90', nome: 'Lançamento — propósito com endereço',
        verso: '"O que a tua mão encontrar para fazer, faze-o com todo o teu poder." — Ec 9:10',
        passos: [
          { n: 'Passo 5', t: 'Honrar as pessoas próximas', d: '1 gesto de honra concreto por semana — cônjuge, filhos, pai ou mãe.', m: ['Semanal', '4 gestos'] },
          { n: 'Passo 6', t: 'Propósito com endereço', d: 'Traduzir identidade em ação de legado. Definir a herança e dar o primeiro passo.', m: ['Dia 90', 'Documentado'] }
        ]
      }
    ]
  },

  caminhante: {
    badge: 'O Caminhante',
    badgeStyle: 'background:rgba(59,109,17,0.2);color:#7ab648;border:0.5px solid rgba(59,109,17,0.4)',
    tagline: 'Tem direção e propósito identificados. A luta agora é de consistência — manter o alinhamento quando a pressão aumenta.',
    desc: 'Sabe quem é, mas ainda cede ao peso das circunstâncias em algumas áreas. A consistência é o que transforma o Caminhante em Edificador. Um ritual por vez.',
    perigo: 'Desafio: a consistência é o que transforma o Caminhante em Edificador. Um ritual por vez.',
    passos: [
      'Implemente o Cronograma do Reino: Segunda (legado), Quarta (filtro ético), Sexta (auditoria relacional).',
      'Crie um ritual semanal de Shabbat — um dia sem trabalho, dedicado ao descanso e à família.',
      'Encontre um Edificador como mentor. Quem está na frente encurta seu caminho.',
      'Comprometa-se com uma área de serviço — igrejas, comunidades, projetos sociais.'
    ],
    fases: [
      {
        periodo: 'Dias 1–30', nome: 'Calibração — rituais inabaláveis',
        verso: '"Quem é fiel no mínimo, também é fiel no muito." — Lc 16:10',
        passos: [
          { n: 'Passo 1', t: 'Cronograma do Reino', d: 'Segunda (legado), Quarta (filtro ético), Sexta (auditoria relacional). Implemente os três.', m: ['3x/semana', 'Consistente'] },
          { n: 'Passo 2', t: 'Shabbat semanal', d: 'Um dia sem trabalho. Descanso intencional como ato de confiança em O PAPAI.', m: ['Semanal', '30 dias'] }
        ]
      },
      {
        periodo: 'Dias 31–60', nome: 'Mentor e multiplicação',
        verso: '"O ferro afia o ferro, assim o homem afia o seu próximo." — Pv 27:17',
        passos: [
          { n: 'Passo 3', t: 'Encontre um Edificador mentor', d: 'Identifique e peça mentoria formal. Quem está na frente encurta seu caminho.', m: ['Semana 5', '1 mentor'] },
          { n: 'Passo 4', t: 'Área de serviço', d: 'Igreja, projeto social, comunidade. Onde você entrega sem esperar retorno.', m: ['Semanas 6–8', '1 compromisso'] }
        ]
      },
      {
        periodo: 'Dias 61–90', nome: 'Legado — estruturar o que vai durar',
        verso: '"Toda a terra que você está vendo darei a você e à sua descendência para sempre." — Gn 13:15',
        passos: [
          { n: 'Passo 5', t: 'Documentar o legado', d: 'Escrever a herança espiritual, familiar e financeira para seus filhos.', m: ['Semanas 9–12', 'Documento'] },
          { n: 'Passo 6', t: 'Investir em um Desperto', d: 'Identifique alguém em estágio anterior ao seu e invista intencionalmente.', m: ['Dias 80–90', '1 pessoa'] }
        ]
      }
    ]
  },

  edificador: {
    badge: 'O Edificador',
    badgeStyle: 'background:rgba(201,168,76,0.25);color:#f5e6c0;border:0.5px solid rgba(201,168,76,0.6)',
    tagline: 'Vive alinhado nos três eixos. Não é perfeito — é intencional. Constrói legado e multiplica o que recebeu.',
    desc: 'Caminha como Abrão depois da separação de Ló: com clareza profética e propósito inabalável. O Edificador que não multiplica desperdiça o maior presente que recebeu.',
    perigo: 'Missão: multiplicar. O Edificador que não multiplica desperdiça o maior presente que recebeu.',
    passos: [
      'Documente sua história completa e considere fazer parte das 50 entrevistas do projeto.',
      'Identifique um Adormecido e um Desperto ao seu redor para investir intencionalmente.',
      'Estruture seu legado: trusts, políticas de governança familiar, projetos filantrópicos.',
      'Junte-se à comunidade fechada dos Edificadores — líderes que constroem juntos o que nenhum constrói sozinho.'
    ],
    fases: [
      {
        periodo: 'Dias 1–30', nome: 'Calibração — revisar o altar',
        verso: '"Feche a planilha, dobre os joelhos e peça a Deus para calibrar sua visão."',
        passos: [
          { n: 'Passo 1', t: 'Revisão do altar diário', d: 'Onde entrou a complacência? Reativar dependência de O PAPAI como postura, não crise.', m: ['Diário', 'Auditoria semanal'] },
          { n: 'Passo 2', t: 'Nomear onde a abundância adormeceu', d: 'Em qual das 5 áreas você está no automático? Nomear e agir.', m: ['Semana 1', '1 área'] }
        ]
      },
      {
        periodo: 'Dias 31–60', nome: 'Multiplicação e discipulado',
        verso: '"Ide, portanto, e fazei discípulos de todas as nações." — Mt 28:19',
        passos: [
          { n: 'Passo 3', t: 'Transmitir para uma pessoa', d: 'O que você aprendeu? Invista intencionalmente em um Adormecido ou Desperto.', m: ['Semanas 5–8', '1 pessoa'] },
          { n: 'Passo 4', t: 'Considerar as 50 entrevistas', d: 'Sua história pode mapear o caminho para outros.', m: ['Semana 6', 'Decisão'] }
        ]
      },
      {
        periodo: 'Dias 61–90', nome: 'Legado formalizado',
        verso: '"O homem de bem deixa herança aos filhos dos seus filhos." — Pv 13:22',
        passos: [
          { n: 'Passo 5', t: 'Documentar a herança', d: 'Espiritual, familiar, financeira. Trusts, governança familiar ou projetos filantrópicos.', m: ['Semanas 9–11', 'Documento formal'] },
          { n: 'Passo 6', t: 'Comunidade dos Edificadores', d: 'Líderes que constroem juntos o que nenhum constrói sozinho.', m: ['Dia 90', 'Integrado'] }
        ]
      }
    ]
  }
};

/* ──────────────────────────────
   NAVEGAÇÃO
────────────────────────────── */
function goScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ──────────────────────────────
   UTILITÁRIOS
────────────────────────────── */
function togglePwd(id, btn) {
  var inp = document.getElementById(id);
  var show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
}

function selScale(btn, name, val) {
  var row = btn.parentElement;
  row.querySelectorAll('.scale-btn').forEach(function(b) {
    b.classList.remove('sel');
  });
  btn.classList.add('sel');
  escores[name] = val;
}

function setBif(val) {
  bifEstado = val;
  document.getElementById('bif-sim').classList.toggle('sel', val === 'sim');
  document.getElementById('bif-nao').classList.toggle('sel', val === 'nao');
  document.getElementById('eixo2-casado').style.display = val === 'sim' ? 'block' : 'none';
  document.getElementById('eixo2-solteiro').style.display = val === 'nao' ? 'block' : 'none';
}

/* ──────────────────────────────
   VALIDAÇÃO DO CADASTRO
────────────────────────────── */
function validarCadastro() {
  var nome = document.getElementById('c-nome').value.trim();
  var email = document.getElementById('c-email').value.trim();
  var s1 = document.getElementById('c-senha').value;
  var s2 = document.getElementById('c-senha2').value;

  if (!nome) { alert('Informe como quer ser chamado.'); return; }
  if (!email || !email.includes('@')) { alert('Informe um email válido.'); return; }
  if (s1.length < 6) { alert('A senha precisa ter no mínimo 6 caracteres.'); return; }
  if (s1 !== s2) { alert('As senhas não coincidem.'); return; }

  U.nome = nome;

  var origem = document.getElementById('c-origem').value;
  if (origem === 'sim') {
    // Importa perfil do Da Morte Para a Vida
    U.perfil = 'desperto';
    U.scores = { p: 60, a: 55, pr: 58 };
    salvarCadastroNoBackend();
    montarResultado();
    goScreen('s-resultado');
  } else {
    goScreen('s-diag');
  }
}

/* ──────────────────────────────
   CÁLCULO DO DIAGNÓSTICO
────────────────────────────── */
function calcularDiag() {
  if (!bifEstado) {
    alert('Informe se você é casado ou solteiro antes de continuar.');
    return;
  }

  // Eixo 1 — O PAPAI (P01, P02, P03)
  var p1sum = 0, p1c = 0;
  ['p01', 'p02', 'p03'].forEach(function(k) {
    if (escores[k]) { p1sum += escores[k]; p1c++; }
  });
  var sP = p1c > 0 ? Math.round((p1sum / (p1c * 5)) * 100) : 40;

  // Eixo 2 — Aliança
  var p2sum = 0, p2c = 0;
  if (bifEstado === 'sim') {
    ['p06', 'p08'].forEach(function(k) {
      if (escores[k]) { p2sum += escores[k]; p2c++; }
    });
  } else {
    if (escores['p07b']) { p2sum += escores['p07b']; p2c++; }
  }
  var sA = p2c > 0 ? Math.round((p2sum / (p2c * 5)) * 100) : 40;

  var sPr = Math.round((sP + sA) / 2);
  var total = sPr / 100 * 5;

  // Faixas de score — Da Morte Para a Vida
  var perfil;
  if (total < 2.0) perfil = 'adormecido';
  else if (total < 3.0) perfil = 'desperto';
  else if (total < 4.2) perfil = 'caminhante';
  else perfil = 'edificador';

  U.perfil = perfil;
  U.scores = { p: sP, a: sA, pr: sPr };

  salvarCadastroNoBackend();
  montarResultado();
  goScreen('s-resultado');
}

/* ──────────────────────────────
   INTEGRAÇÃO BACKEND (API)
────────────────────────────── */
function salvarCadastroNoBackend() {
  var nome = document.getElementById('c-nome').value.trim();
  var email = document.getElementById('c-email').value.trim();
  var whatsapp = document.getElementById('c-whatsapp').value.trim();
  var cidade = document.getElementById('c-cidade').value.trim();
  var estado = document.getElementById('c-estado').value.trim();
  var idade = document.getElementById('c-idade').value ? parseInt(document.getElementById('c-idade').value) : null;
  var estado_civil = document.getElementById('c-civil').value;
  var filhos = document.getElementById('c-filhos').value;
  var ocupacao = document.getElementById('c-ocupacao').value;
  var origem = document.getElementById('c-origem').value;

  var respostas_texto = {
    p04: document.getElementById('p04') ? document.getElementById('p04').value.trim() : '',
    p05: document.getElementById('p05') ? document.getElementById('p05').value.trim() : '',
    p07: document.getElementById('p07') ? document.getElementById('p07').value.trim() : '',
    p09: document.getElementById('p09') ? document.getElementById('p09').value.trim() : '',
    p10: document.getElementById('p10') ? document.getElementById('p10').value.trim() : '',
    p06b: document.getElementById('p06b') ? document.getElementById('p06b').value.trim() : '',
    p08b: document.getElementById('p08b') ? document.getElementById('p08b').value.trim() : '',
    p11: document.getElementById('p11') ? document.getElementById('p11').value.trim() : '',
    p12: document.getElementById('p12') ? document.getElementById('p12').value.trim() : '',
    p13: document.getElementById('p13') ? document.getElementById('p13').value.trim() : '',
    p14: document.getElementById('p14') ? document.getElementById('p14').value.trim() : '',
    p15: document.getElementById('p15') ? document.getElementById('p15').value.trim() : ''
  };

  var bodyData = {
    nome: nome,
    email: email,
    whatsapp: whatsapp,
    cidade: cidade,
    estado: estado,
    idade: idade,
    estado_civil: estado_civil,
    filhos: filhos,
    ocupacao: ocupacao,
    perfil: U.perfil,
    score_papai: U.scores ? U.scores.p : null,
    score_alianca: U.scores ? U.scores.a : null,
    score_proposito: U.scores ? U.scores.pr : null,
    casado: bifEstado === 'sim',
    respostas_texto: respostas_texto,
    origem: origem
  };

  fetch('/api/cadastro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    console.log('Cadastro salvo no backend:', data);
  })
  .catch(function(err) {
    console.error('Erro ao salvar no backend:', err);
  });
}

/* ──────────────────────────────
   MONTAR TELA DE RESULTADO
────────────────────────────── */
function montarResultado() {
  var d = PERFIS[U.perfil];
  var html = '';

  // Hero do perfil
  html += '<div class="perfil-hero">';
  html += '<div class="perfil-badge" style="' + d.badgeStyle + '">' + d.badge + '</div>';
  html += '<div class="perfil-nome">' + U.nome + ', você é ' + d.badge + '</div>';
  html += '<div class="perfil-tagline">' + d.tagline + '</div>';
  html += '</div>';

  // Scores por eixo
  if (U.scores) {
    html += '<div class="scores-row">';
    var eixos = [['O PAPAI', U.scores.p], ['Aliança', U.scores.a], ['Propósito', U.scores.pr]];
    eixos.forEach(function(e) {
      html += '<div class="score-card">';
      html += '<div class="score-eixo">' + e[0] + '</div>';
      html += '<div class="score-val">' + e[1] + '</div>';
      html += '<div class="score-bar-wrap"><div class="score-bar-fill" style="width:' + e[1] + '%"></div></div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Descrição
  html += '<div class="desc-box"><p>' + d.desc + '</p></div>';

  // Perigo / oportunidade
  html += '<div class="perigo-box"><strong>✦ </strong>' + d.perigo + '</div>';

  // Próximos passos
  html += '<div class="passos-title">Próximos passos para você</div>';
  d.passos.forEach(function(p, i) {
    html += '<div class="passo-item">';
    html += '<div class="passo-num">' + (i + 1) + '</div>';
    html += '<div class="passo-text">' + p + '</div>';
    html += '</div>';
  });

  document.getElementById('res-conteudo').innerHTML = html;
}

/* ──────────────────────────────
   IR PARA O PLANO
────────────────────────────── */
function goPlano() {
  var subs = {
    adormecido: 'Você está acordando. Os 90 dias a seguir têm um objetivo: estabelecer identidade real — antes de qualquer função ou papel. O leão não nasce rugindo, mas nasce leão.',
    desperto: 'Você está entre o casulo e o voo. Não é hora de voltar — é hora de estruturar.',
    caminhante: 'Você tem direção. Os 90 dias a seguir vão transformar intenção em consistência — e consistência em legado.',
    edificador: 'Você está alinhado. Os 90 dias a seguir vão escalar o que você construiu e formalizar o que suas gerações vão herdar.'
  };

  document.getElementById('plano-title').textContent = U.nome + ', seu Plano de 90 dias';
  document.getElementById('plano-sub').textContent = subs[U.perfil];

  renderFase(0);
  goScreen('s-plano');
}

/* ──────────────────────────────
   RENDERIZAR FASES DO PLANO
────────────────────────────── */
function renderFase(idx) {
  var fases = PERFIS[U.perfil].fases;
  var container = document.getElementById('fases-container');
  container.innerHTML = '';

  fases.forEach(function(fase, i) {
    var div = document.createElement('div');
    div.className = 'fase-content' + (i === idx ? ' active' : '');

    var h = '<div class="fase-periodo">' + fase.periodo + '</div>';
    h += '<div class="fase-nome">' + fase.nome + '</div>';
    h += '<div class="fase-verso">' + fase.verso + '</div>';

    fase.passos.forEach(function(p) {
      h += '<div class="passo-card">';
      h += '<div class="passo-card-num">' + p.n + '</div>';
      h += '<div class="passo-card-title">' + p.t + '</div>';
      h += '<div class="passo-card-desc">' + p.d + '</div>';
      h += '<div class="passo-meta">';
      p.m.forEach(function(tag) {
        h += '<span class="meta-tag">' + tag + '</span>';
      });
      h += '</div></div>';
    });

    div.innerHTML = h;
    container.appendChild(div);
  });
}

function showFase(idx, btn) {
  document.querySelectorAll('.fase-tab').forEach(function(t) {
    t.classList.remove('active');
  });
  btn.classList.add('active');
  renderFase(idx);
}

/* ──────────────────────────────
   PAGAMENTO
────────────────────────────── */
function processarPagamento() {
  // TODO: integrar Hotmart ou Stripe
  alert('Integração de pagamento a configurar. PIX ou cartão via Hotmart / Stripe.');
}
