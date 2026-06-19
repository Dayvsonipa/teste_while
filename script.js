let perguntas = [];
let perguntasSorteadas = [];
let perguntaAtual = 0;
let acertos = 0;
let erros = 0;
let tentativasNaQuestao = 0;
let nomeAluno = "";

const TOTAL_QUESTOES_DO_JOGO = 20;

// Carrega as perguntas do arquivo JSON
fetch("perguntas.json")
  .then(resposta => resposta.json())
  .then(dados => {
    perguntas = dados;
  })
  .catch(erro => {
    console.error("Erro ao carregar o JSON:", erro);
  });

function iniciarJogo() {
  const inputNome = document.getElementById("nomeAluno");

  nomeAluno = inputNome.value.trim();

  if (nomeAluno === "") {
    alert("Digite seu nome antes de iniciar.");
    return;
  }

  if (perguntas.length === 0) {
    alert("As perguntas ainda não foram carregadas.");
    return;
  }

  if (perguntas.length < TOTAL_QUESTOES_DO_JOGO) {
    alert("O arquivo perguntas.json precisa ter pelo menos 20 questões.");
    return;
  }

  acertos = 0;
  erros = 0;
  perguntaAtual = 0;
  tentativasNaQuestao = 0;

  perguntasSorteadas = sortearPerguntas(perguntas).slice(0, TOTAL_QUESTOES_DO_JOGO);

  document.getElementById("acertos").textContent = acertos;
  document.getElementById("erros").textContent = erros;
  document.getElementById("nomeNaTela").textContent = nomeAluno;

  document.getElementById("tela-inicial").classList.add("escondido");
  document.getElementById("tela-jogo").classList.remove("escondido");

  mostrarPergunta();
}

function sortearPerguntas(lista) {
  let novaLista = [...lista];

  for (let i = novaLista.length - 1; i > 0; i--) {
    let sorteado = Math.floor(Math.random() * (i + 1));

    let temporario = novaLista[i];
    novaLista[i] = novaLista[sorteado];
    novaLista[sorteado] = temporario;
  }

  return novaLista;
}

function mostrarPergunta() {
  const questao = perguntasSorteadas[perguntaAtual];

  tentativasNaQuestao = 0;

  document.getElementById("tituloQuestao").textContent = `Questão ${perguntaAtual + 1}`;
  document.getElementById("enunciado").textContent = questao.enunciado;
  document.getElementById("codigo").textContent = questao.codigo;

  document.getElementById("acertos").textContent = acertos;
  document.getElementById("erros").textContent = erros;
  document.getElementById("progresso").textContent =
    `${perguntaAtual + 1}/${TOTAL_QUESTOES_DO_JOGO}`;
  document.getElementById("tentativa").textContent = "1/2";

  document.getElementById("respostaAluno").value = "";
  document.getElementById("mensagem").textContent = "";
  document.getElementById("mensagem").className = "";

  document.getElementById("btnVerificar").disabled = false;
  document.getElementById("respostaAluno").disabled = false;
  document.getElementById("respostaAluno").focus();
}

function verificarResposta() {
  const inputResposta = document.getElementById("respostaAluno");
  const botaoVerificar = document.getElementById("btnVerificar");
  const respostaAluno = normalizarResposta(inputResposta.value);

  if (respostaAluno === "") {
    alert("Digite uma condição antes de verificar.");
    return;
  }

  const questao = perguntasSorteadas[perguntaAtual];

  const respostasCorretas = questao.respostas.map(resposta =>
    normalizarResposta(resposta)
  );

  const mensagem = document.getElementById("mensagem");

  if (respostasCorretas.includes(respostaAluno)) {
    acertos++;

    document.getElementById("acertos").textContent = acertos;

    mensagem.textContent = "Correto! Muito bem.";
    mensagem.className = "correto";

    botaoVerificar.disabled = true;
    inputResposta.disabled = true;

    setTimeout(proximaPergunta, 1000);
    return;
  }

  tentativasNaQuestao++;

  if (tentativasNaQuestao === 1) {
    mensagem.textContent = "Ainda não. Você tem mais uma tentativa nesta questão.";
    mensagem.className = "errado";

    document.getElementById("tentativa").textContent = "2/2";

    inputResposta.value = "";
    inputResposta.focus();
    return;
  }

  erros++;

  document.getElementById("erros").textContent = erros;

  mensagem.textContent = "Resposta incorreta. Será contado 1 erro nesta questão. Vamos para a próxima.";
  mensagem.className = "errado";

  botaoVerificar.disabled = true;
  inputResposta.disabled = true;

  setTimeout(proximaPergunta, 1500);
}

function proximaPergunta() {
  perguntaAtual++;

  if (perguntaAtual >= TOTAL_QUESTOES_DO_JOGO) {
    salvarRanking();
    finalizarJogo();
    return;
  }

  mostrarPergunta();
}

function normalizarResposta(texto) {
  return texto
    .trim()
    .replace(/\s+/g, "")
    .replace(/;/g, "")
    .toLowerCase();
}

function salvarRanking() {
  const rankingSalvo = localStorage.getItem("rankingWhile");

  let ranking = [];

  if (rankingSalvo !== null) {
    ranking = JSON.parse(rankingSalvo);
  }

  const aluno = {
    nome: nomeAluno,
    acertos: acertos,
    erros: erros,
    totalQuestoes: TOTAL_QUESTOES_DO_JOGO,
    data: new Date().toLocaleString("pt-BR")
  };

  ranking.push(aluno);

  ranking.sort((a, b) => {
    if (b.acertos !== a.acertos) {
      return b.acertos - a.acertos;
    }

    return a.erros - b.erros;
  });

  localStorage.setItem("rankingWhile", JSON.stringify(ranking));
}

function finalizarJogo() {
  document.getElementById("tela-jogo").classList.add("escondido");
  document.getElementById("tela-final").classList.remove("escondido");

  document.getElementById("mensagemFinal").textContent =
    `Congratulations, ${nomeAluno}! Você fez ${acertos} acertos de ${TOTAL_QUESTOES_DO_JOGO}.`;
}

function reiniciar() {
  perguntaAtual = 0;
  acertos = 0;
  erros = 0;
  tentativasNaQuestao = 0;
  nomeAluno = "";
  perguntasSorteadas = [];

  document.getElementById("acertos").textContent = "0";
  document.getElementById("erros").textContent = "0";
  document.getElementById("nomeAluno").value = "";
  document.getElementById("progresso").textContent = "1/20";
  document.getElementById("tentativa").textContent = "1/2";

  document.getElementById("tela-final").classList.add("escondido");
  document.getElementById("tela-inicial").classList.remove("escondido");
}