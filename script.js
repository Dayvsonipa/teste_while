let perguntas = [];
let perguntasSorteadas = [];
let perguntaAtual = 0;
let acertos = 0;
let erros = 0;
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

  acertos = 0;
  erros = 0;
  perguntaAtual = 0;

  document.getElementById("acertos").textContent = acertos;
  document.getElementById("nomeNaTela").textContent = nomeAluno;

  perguntasSorteadas = sortearPerguntas(perguntas);

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

  document.getElementById("tituloQuestao").textContent = `Questão ${perguntaAtual + 1}`;
  document.getElementById("enunciado").textContent = questao.enunciado;
  document.getElementById("codigo").textContent = questao.codigo;

  document.getElementById("respostaAluno").value = "";
  document.getElementById("mensagem").textContent = "";
  document.getElementById("mensagem").className = "";

  document.getElementById("respostaAluno").focus();
}

function verificarResposta() {
  const inputResposta = document.getElementById("respostaAluno");
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

    if (acertos >= 20) {
      salvarRanking();
      setTimeout(finalizarJogo, 1000);
      return;
    }

    setTimeout(proximaPergunta, 1000);

  } else {
    erros++;

    mensagem.textContent = "Ainda não. Observe a variável, o valor inicial e até quando o laço deve repetir.";
    mensagem.className = "errado";
  }
}

function proximaPergunta() {
  perguntaAtual++;

  if (perguntaAtual >= perguntasSorteadas.length) {
    perguntaAtual = 0;
    perguntasSorteadas = sortearPerguntas(perguntas);
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
    `Congratulations, ${nomeAluno}!`;
}

function reiniciar() {
  perguntaAtual = 0;
  acertos = 0;
  erros = 0;
  nomeAluno = "";
  perguntasSorteadas = [];

  document.getElementById("acertos").textContent = "0";
  document.getElementById("nomeAluno").value = "";

  document.getElementById("tela-final").classList.add("escondido");
  document.getElementById("tela-inicial").classList.remove("escondido");
}