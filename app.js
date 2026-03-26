// 1. Captura de Elemento do Dom
const inputDesc = document.querySelector("#desc-despesa");
const inputValor = document.querySelector("#valor-gringo");
const inputCotacao = document.querySelector("#valor-cotacao");
const btnAdicionar = document.querySelector("#btn-adicionar");
const listaDespesasDOM = document.querySelector("#lista-despesas");
const totalBrlDOM = document.querySelector("#total-br");

//2. Estado da Aplicação (Array de Objetos)
// Tentamos buscar dados salvos previamente. Se não houver, iniciamos um Array vazio [].
let despesas = JSON.parse(localStorage.getItem("viagem_despesas")) || [];

// 3. Função para Persistir Dados
const salvarNoLocalStorage = () => {
  // O localStorage só aceita guardar textos (Strings).
  // JSON.stringify converte nosso Array em formato de texto.
  localStorage.setItem("viagem_despesas", JSON.stringify(despesas));
};

const adicionarDespesa = () => {
  // O método .trim() remove espaços em branco acidentais no início e no fim do texto.
  const desc = inputDesc.value.trim();

  // parseFloat converte o texto digitado no input para um número decimal nativo do JS.
  const valorOriginal = parseFloat(inputValor.value);
  const cotacao = parseFloat(inputCotacao.value);

  // Validação de Dados (condicional)
  // isNaN significa "Is Not a Number" (Não é um número). Verifica se a conversão falhou.
  if (desc == "" || isNaN(valorOriginal) || isNaN(cotacao)) {
    alert(
      "Por favor, preencha todos os campos corretamente com valores válidos."
    );

    return; // Interrompe a execução da função imediatamente.
  }

  // Processamento Lógico (Operador Aritmétrico)
  const valorConvertidoBRL = valorOriginal * cotacao;

  //Estrutura de Dados: Criando um objeto para representar umma única despesa

  const novaDespesa = {
    id: Date.now(), // Gera um número único baseado nos milissegundos atuais para indentificar o item
    descricao: desc,
    valorEstrangeiro: valorOriginal,
    valorReal: valorConvertidoBRL,
    cotacao: cotacao,
  };

  // Modificando o Array e salvando
  despesas.push(novaDespesa);
  salvarNoLocalStorage();

  // Limpeza da Interface
  inputDesc.value = "";
  inputValor.value = "";
  inputCotacao.value = "";
  // Chama a função que vai desenhar a lista na tela (que criaremos no próximo passo)
  atualizarTela();
};

// Vinculando a ação ao clique do botão
btnAdicionar.addEventListener("click", adicionarDespesa);

const atualizarTela = () => {
  // 1. Gerando os itens da lista usando o método .map()
  // O map percorre o Array e retorna um novo Array contendo os blocos de HTML.
  const htmlDaLista = despesas.map((item) => {
    // O método .toFixed(2) garante a exibição com duas casas decimais.

    return `
    <li>
    <div>
    <strong>${item.descricao}</strong> <br>

    <button class="btn-excluir" data-id="${item.id}">X</button>

    <small>U$ ${item.valorEstrangeiro.toFixed(2)} x ${item.cotacao}</small>
</div>
<span class="valor">R$ ${item.valorReal.toFixed(2)}</span>
</li>
`;
  });
  // O .join('') une todos os blocos gerados pelo map em um único texto contínuo,

  // que é então injetado na tag <ul> do nosso HTML.
  listaDespesasDOM.innerHTML = htmlDaLista.join("");

  // 2. Calculando o Total usando o método .forEach()
  let somaTotal = 0;
  // O forEach executa uma função para cada item, somando o valorReal à nossa variável.
  despesas.forEach((item) => {
    somaTotal += item.valorReal; // Equivalente a: somaTotal = somaTotal +item.valorReal;
  });
  // Atualizando o elemento de texto no cabeçalho
  totalBrlDOM.textContent = `R$ ${somaTotal.toFixed(2)}`;
};

// Execução Inicial: Chamamos a função assim que o script carrega para renderizar

// dados antigos que já possam estar salvos no LocalStorage.
atualizarTela();

// Função para remover despesa
const removerDespesa = (id) => {
    despesas = despesas.filter((item) => item.id !== id);
    salvarNoLocalStorage();
    atualizarTela();
  };
  // Botão excluir
  listaDespesasDOM.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-excluir")) {
      const id = Number(event.target.getAttribute("data-id"));
      removerDespesa(id);
    }
  });