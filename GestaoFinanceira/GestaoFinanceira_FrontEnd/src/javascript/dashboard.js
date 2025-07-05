// src/javascript/dashboard.js

// ... (seus imports e declarações de variáveis)

// Adicionei comentários e fiz pequenas melhorias para garantir o acesso correto
// Removi a chamada await window.carregarTransacoesDoBanco() daqui, pois o DOMContentLoaded global já cuida disso.
// A chamada final window.atualizarDashboard() no final do arquivo cuidará da atualização inicial.
document.addEventListener("DOMContentLoaded", () => { // Removido 'async' aqui, pois a busca inicial é feita em global.js
  // Removido o bloco de await window.carregarTransacoesDoBanco() daqui

  const ctxGraficoDashboard = document.getElementById("graficoDespesasCategoriasDashboard");
  let graficoDashboardDespesasInstance = null;

  const saldoGeralElement = document.getElementById("saldoGeral");
  const receitaMensalElement = document.getElementById("receitaMensal");
  const despesaMensalElement = document.getElementById("despesaMensal");
  const listaTransacoesRecentes = document.getElementById("listaTransacoes");
  const tbodyGastos = document.getElementById("tabelaGastos");

  const btnAdicionarMeta = document.getElementById("btnAdicionarMeta");
  const inputMeta = document.getElementById("inputMeta");
  const formMeta = document.getElementById("formMeta");
  const resultadoMeta = document.getElementById("resultadoMeta");
  const infoMeta = document.querySelector(".meta-info");
  const barraProgresso = document.querySelector(".progresso");

  const META_KEY = "dashboardMetaDeReceita";

  function formatarDataParaExibicao(dataStr) {
    // Garante que a data está vindo como string 'YYYY-MM-DD'
    const data = new Date(dataStr + 'T00:00:00');
    return data.toLocaleDateString("pt-BR");
  }

  function atualizarValoresFinanceiros(transacoesDoMes) {
    let totalReceitasMes = 0;
    let totalDespesasMes = 0;

    transacoesDoMes.forEach(t => {
      // Acessa sempre o nome dentro de tipoTransacao e converte para lowercase
      const tipo = t.tipoTransacao?.nome?.toLowerCase(); 
      if (tipo === 'receita') {
        totalReceitasMes += t.valor;
      } else if (tipo === 'despesa') {
        totalDespesasMes += t.valor;
      }
    });

    const saldoGeralMes = totalReceitasMes - totalDespesasMes;

    if (saldoGeralElement) {
      saldoGeralElement.textContent = saldoGeralMes.toFixed(2);
      saldoGeralElement.classList.toggle('negativo', saldoGeralMes < 0);
      saldoGeralElement.classList.toggle('positivo', saldoGeralMes >= 0);
    }
    if (receitaMensalElement) {
      receitaMensalElement.textContent = `+ ${totalReceitasMes.toFixed(2)}`;
    }
    if (despesaMensalElement) {
      despesaMensalElement.textContent = `- ${totalDespesasMes.toFixed(2)}`;
    }
  }

  function atualizarGraficoDashboardDespesas(transacoesMesAtual) {
    if (!ctxGraficoDashboard) return;

    const despesasPorCategoria = transacoesMesAtual
      // Acessa o nome dentro de tipoTransacao e converte para lowercase
      .filter(t => t.tipoTransacao?.nome?.toLowerCase() === 'despesa')
      .reduce((acc, transacao) => {
        // Acessa o nome dentro de categoria
        const nomeCategoria = transacao.categoria?.nome || "Sem categoria"; 
        acc[nomeCategoria] = (acc[nomeCategoria] || 0) + transacao.valor;
        return acc;
      }, {});

    const labels = Object.keys(despesasPorCategoria);
    const data = Object.values(despesasPorCategoria);
    const backgroundColors = window.gerarCoresAleatorias
      ? window.gerarCoresAleatorias(labels.length)
      : ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    if (graficoDashboardDespesasInstance) {
      graficoDashboardDespesasInstance.destroy();
    }

    graficoDashboardDespesasInstance = new Chart(ctxGraficoDashboard.getContext('2d'), {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColors,
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#3b0764',
              font: { size: 14, family: 'Poppins' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  function atualizarTabelaMaioresGastos(transacoesDoMes) {
    if (!tbodyGastos) return;
    tbodyGastos.innerHTML = "";

    const despesasOrdenadas = transacoesDoMes
      // Acessa o nome dentro de tipoTransacao e converte para lowercase
      .filter(t => t.tipoTransacao?.nome?.toLowerCase() === 'despesa')
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);

    if (despesasOrdenadas.length === 0) {
      tbodyGastos.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhuma despesa para exibir.</td></tr>`;
      return;
    }

    despesasOrdenadas.forEach(gasto => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${gasto.descricao}</td>
        <td>${gasto.categoria?.nome}</td> <td>${formatarDataParaExibicao(gasto.data_transacao)}</td> <td>R$ ${gasto.valor.toFixed(2)}</td>
      `;
      tbodyGastos.appendChild(tr);
    });
  }

  function filtrarUltimos5Dias(transacoes) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const cincoDiasAtras = new Date(hoje);
    cincoDiasAtras.setDate(hoje.getDate() - 4); // Ajustado para ser 5 dias atrás, incluindo o dia atual
    cincoDiasAtras.setHours(0, 0, 0, 0);

    return transacoes.filter(t => {
      // Acessa data_transacao
      const dataParts = t.data_transacao.split("-");
      const dataTransacao = new Date(dataParts[0], dataParts[1] - 1, dataParts[2]);

      dataTransacao.setHours(0, 0, 0, 0);
      return dataTransacao >= cincoDiasAtras && dataTransacao <= hoje;
    });
  }

  function mostrarTransacoesRecentes(transacoes) {
    if (!listaTransacoesRecentes) return;
    listaTransacoesRecentes.innerHTML = "";

    if (transacoes.length === 0) {
      listaTransacoesRecentes.innerHTML = `<li class="transacao-item" style="text-align: center;">Nenhuma transação recente.</li>`;
      return;
    }

    transacoes.sort((a, b) => {
      // Acessa data_transacao
      const dateA = new Date(a.data_transacao + 'T00:00:00');
      const dateB = new Date(b.data_transacao + 'T00:00:00');
      return dateB - dateA;
    });

    transacoes.forEach(t => {
      const li = document.createElement("li");
      li.classList.add("transacao-item");
      li.innerHTML = `
        <div class="transacao-info">
          <span class="transacao-tipo ${t.tipoTransacao?.nome?.toLowerCase() === "receita" ? "transacao-receita" : "transacao-despesa"}">
  ${t.tipoTransacao?.nome?.toLowerCase() === "receita"
    ? "<i class='fa-solid fa-arrow-up-wide-short'></i> Receita"
    : "<i class='fa-solid fa-arrow-down-wide-short'></i> Despesa"}
</span>
<span>${t.categoria?.nome} – ${formatarDataParaExibicao(t.data_transacao)}</span> </div>
        <span><strong>R$ ${t.valor.toFixed(2)}</strong></span>
      `;
      listaTransacoesRecentes.appendChild(li);
    });
  }

  function getReceitaUltimos5DiasParaMeta() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const cincoDiasAtras = new Date(hoje);
    cincoDiasAtras.setDate(hoje.getDate() - 4);
    cincoDiasAtras.setHours(0, 0, 0, 0);

    if (!window.transacoesParaFiltro) return 0;

    return window.transacoesParaFiltro
      .filter(t => {
        // Acessa data_transacao
        const dataTransacao = new Date(t.data_transacao + 'T00:00:00');
        dataTransacao.setHours(0, 0, 0, 0);
        // Acessa tipoTransacao?.nome
        return t.tipoTransacao?.nome?.toLowerCase() === "receita"
          && dataTransacao >= cincoDiasAtras && dataTransacao <= hoje;
      })
      .reduce((soma, t) => soma + t.valor, 0);
  }

  function atualizarExibicaoMeta(meta) {
    const atingido = getReceitaUltimos5DiasParaMeta();
    const percentual = Math.min((atingido / meta) * 100, 100);

    if (!infoMeta || !barraProgresso) return;

    infoMeta.innerHTML = `
      <p><strong>Meta de economia:</strong> R$${meta.toFixed(2)}</p>
      <p><strong>Receita atingida (últimos 5 dias):</strong> R$${atingido.toFixed(2)} — ${percentual.toFixed(0)}% completo</p>
    `;
    barraProgresso.style.width = `${percentual}%`;
  }

  function carregarMetaESetupInicial() {
    const metaSalva = localStorage.getItem(META_KEY);
    if (metaSalva) {
      const metaValor = parseFloat(metaSalva);
      if (!isNaN(metaValor) && metaValor > 0) {
        if (inputMeta) inputMeta.value = metaValor.toFixed(2);
        atualizarExibicaoMeta(metaValor);
        if (formMeta) formMeta.style.display = "none";
        if (resultadoMeta) resultadoMeta.style.display = "block";
        return true;
      }
    }
    if (formMeta) formMeta.style.display = "none";
    if (resultadoMeta) resultadoMeta.style.display = "none";
    return false;
  }

  if (btnAdicionarMeta && formMeta && resultadoMeta && infoMeta && barraProgresso && inputMeta) {
    btnAdicionarMeta.addEventListener("click", () => {
      if (formMeta.style.display === "none") {
        formMeta.style.display = "block";
        resultadoMeta.style.display = "none";
        const metaSalva = localStorage.getItem(META_KEY);
        inputMeta.value = metaSalva ? parseFloat(metaSalva).toFixed(2) : '';
        inputMeta.focus();
      } else {
        formMeta.style.display = "none";
        if (localStorage.getItem(META_KEY)) {
          resultadoMeta.style.display = "block";
        }
      }
    });

    formMeta.addEventListener("submit", (e) => {
      e.preventDefault();
      const meta = parseFloat(inputMeta.value);
      if (isNaN(meta) || meta <= 0) {
        alert("Por favor, insira um valor de meta válido.");
        return;
      }

      localStorage.setItem(META_KEY, meta.toString());
      atualizarExibicaoMeta(meta);
      resultadoMeta.style.display = "block";
      formMeta.style.display = "none";
    });

    carregarMetaESetupInicial();
  }

  // Função principal para atualizar o dashboard
  window.atualizarDashboard = function () {
    if (!window.transacoesParaFiltro || !window.dataReferencia || !window.filtrarPorMes) {
      console.warn("Dados ou funções globais não definidos ainda.");
      return;
    }
    const transacoesMesAtual = window.filtrarPorMes(window.transacoesParaFiltro, window.dataReferencia);
    atualizarValoresFinanceiros(transacoesMesAtual);
    atualizarGraficoDashboardDespesas(transacoesMesAtual);
    atualizarTabelaMaioresGastos(transacoesMesAtual);

    const ultimos5Dias = filtrarUltimos5Dias(window.transacoesParaFiltro);
    mostrarTransacoesRecentes(ultimos5Dias);

    const metaSalva = localStorage.getItem(META_KEY);
    if (metaSalva) {
      const metaValor = parseFloat(metaSalva);
      if (!isNaN(metaValor) && metaValor > 0) {
        if (resultadoMeta && (resultadoMeta.style.display === "block" || localStorage.getItem(META_KEY))) {
          atualizarExibicaoMeta(metaValor);
          if (formMeta) formMeta.style.display = "none";
          if (resultadoMeta) resultadoMeta.style.display = "block";
        }
      }
    }
  };
  // Atualiza o dashboard quando as transações são carregadas ou mês é alterado
  document.addEventListener('transacoesAtualizadas', () => {
    window.atualizarDashboard();
  });

  document.addEventListener('mesReferenciaGlobalAlterado', () => {
    window.atualizarDashboard();
  });

  // Atualiza o dashboard agora mesmo, após carregar transações
  window.atualizarDashboard();
});