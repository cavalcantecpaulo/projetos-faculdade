// src/javascript/lancamentos.js

document.addEventListener("DOMContentLoaded", () => {
  const listaLancamentos = document.getElementById("listaLancamentos");
  const filtroTipo = document.getElementById("filtro-tipo");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const btnLimparFiltros = document.getElementById("btnLimparFiltros");

  function criarItemLancamento(transacao) {
    const div = document.createElement("div");
    div.classList.add("lancamento-item");
    div.innerHTML = `
      <div class="descricao">${transacao.descricao}</div>
      <div class="categoria">${transacao.categoria?.nome || 'Sem categoria'}</div>
      <div class="data">${new Date(transacao.data_transacao).toLocaleDateString("pt-BR")}</div>
      <div class="valor ${transacao.tipoTransacao?.nome === "receita" ? "valor-receita" : "valor-despesa"}">
        R$ ${transacao.valor.toFixed(2)}
      </div>
    `;
    return div;
  }

  function atualizarListaLancamentos() {
    if (!window.transacoesParaFiltro || !listaLancamentos) return;

    // Filtra pelo mês atual global
    let transacoesMes = window.filtrarPorMes(window.transacoesParaFiltro, window.dataReferencia);

    // Aplica filtro por tipo
    const tipoSelecionado = filtroTipo.value;
    if (tipoSelecionado && tipoSelecionado !== "todos") {
      // Use tipoTransacao?.nome para a filtragem
      transacoesMes = transacoesMes.filter(t => t.tipoTransacao?.nome?.toLowerCase() === tipoSelecionado);
    }

    // Aplica filtro por categoria
    const categoriaSelecionada = filtroCategoria.value;
    if (categoriaSelecionada && categoriaSelecionada !== "todas") {
      // Use categoria?.nome para a filtragem
      transacoesMes = transacoesMes.filter(t => (t.categoria?.nome || '').toLowerCase() === categoriaSelecionada.toLowerCase());
    }

    // Limpa e preenche a lista
    listaLancamentos.innerHTML = "";

    if (transacoesMes.length === 0) {
      listaLancamentos.innerHTML = `<p style="text-align:center; margin-top: 20px;">Nenhum lançamento encontrado.</p>`;
      return;
    }

    transacoesMes.forEach(t => {
      const item = criarItemLancamento(t);
      listaLancamentos.appendChild(item);
    });
  }

  // Eventos dos filtros
  if (filtroTipo) {
    filtroTipo.addEventListener("change", atualizarListaLancamentos);
  }
  if (filtroCategoria) {
    filtroCategoria.addEventListener("change", atualizarListaLancamentos);
  }
  if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener("click", () => {
      if (filtroTipo) filtroTipo.value = "todos";
      if (filtroCategoria) filtroCategoria.value = "todas";
      atualizarListaLancamentos();
    });
  }

  // Função para popular o filtro de categorias (chamada ao carregar e ao atualizar transações)
  window.popularFiltroCategorias = function() {
    if (!filtroCategoria || !window.transacoesParaFiltro) return;

    const categoriasExistentes = new Set(window.transacoesParaFiltro.map(t => t.categoria?.nome).filter(Boolean));
    filtroCategoria.innerHTML = `<option value="" disabled selected>Buscar por Categoria...</option><option value="todas">Todas as categorias</option>`;
    categoriasExistentes.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      filtroCategoria.appendChild(option);
    });
  };

  // Atualiza a lista quando os dados forem atualizados
  document.addEventListener("transacoesAtualizadas", () => {
      window.popularFiltroCategorias(); // Popula categorias ao atualizar
      atualizarListaLancamentos();
  });
  document.addEventListener("mesReferenciaGlobalAlterado", atualizarListaLancamentos);

  // Atualiza logo que carregar a página
  atualizarListaLancamentos();
  window.popularFiltroCategorias(); // Chama no carregamento inicial
});