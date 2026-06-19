let perguntas = [];
let perguntaAtual = 0;
let acertos = 0;
let nomeAluno = "";

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

  document.getElementById("tela-inicial").classList.add("escondido");
  document.getElementById("tela-jogo").classList.remove("escondido");

  document.getElementById("nomeNaTela").textContent = nomeAluno;

  embaralharPerguntas();
  mostrarPergunta();
}

function embaralharPerguntas() {
  perguntas.sort(() => Math.random() - 0.5);
}

function mostrarPergunta() {
  const questao = perguntas[perguntaAtual];

  document.getElementById("tituloQuestao").textContent = `Questão ${perguntaAtual + 1}`;
  document.getElementById("enunciado").textContent = questao.enunciado;
  document.getElementById("codigo").textContent = questao.codigo;

  document.getElementById("respostaAluno").value = "";
  document.getElementById("mensagem").textContent = "";
  document.getElementById("mensagem").className = "";

  document.getElementById("respostaAluno").focus();
}

function verificarResposta() {
  const respostaAluno = normalizarResposta(
    document.getElementById("respostaAluno").value
  );

  const questao = perguntas[perguntaAtual];

  const respostasCorretas = questao.respostas.map(resposta => 
    normalizarResposta(resposta)
  );

  const mensagem = document.getElementById("mensagem");

  if (respostasCorretas.includes(respostaAluno)) {
    acertos++;

    document.getElementById("acertos").textContent = acertos;

    mensagem.textContent = "Correto! Muito bem.";
    mensagem.className = "correto";

    if (acertos >= 20) {
      setTimeout(finalizarJogo, 1000);
      return;
    }

    setTimeout(proximaPergunta, 1000);

  } else {
    mensagem.textContent = "Ainda não. Observe a variável, o valor inicial e até quando o laço deve repetir.";
    mensagem.className = "errado";
  }
}

function proximaPergunta() {
  perguntaAtual++;

  if (perguntaAtual >= perguntas.length) {
    perguntaAtual = 0;
    embaralharPerguntas();
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

function finalizarJogo() {
  document.getElementById("tela-jogo").classList.add("escondido");
  document.getElementById("tela-final").classList.remove("escondido");

  document.getElementById("mensagemFinal").textContent =
    `Congratulations, ${nomeAluno}!`;
}

function reiniciar() {
  perguntaAtual = 0;
  acertos = 0;
  nomeAluno = "";

  document.getElementById("acertos").textContent = "0";
  document.getElementById("nomeAluno").value = "";

  document.getElementById("tela-final").classList.add("escondido");
  document.getElementById("tela-inicial").classList.remove("escondido");
}