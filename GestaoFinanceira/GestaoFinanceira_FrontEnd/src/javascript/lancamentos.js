// src/javascript/lancamentos.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded para lancamentos.js acionado.");

    const listaLancamentos = document.getElementById("listaLancamentos");
    const filtroTipo = document.getElementById("filtro-tipo");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const btnLimparFiltros = document.getElementById("btnLimparFiltros");

    // Verifica se os elementos HTML foram encontrados
    if (!listaLancamentos) {
        console.error("Elemento #listaLancamentos não encontrado no DOM. Verifique seu HTML.");
        return; // Impede a execução se o elemento principal não existir
    }

    // Função para criar o item de lançamento com a estrutura HTML que seu CSS espera
    function criarItemLancamento(transacao) {
        const item = document.createElement("div");
        item.classList.add("item-lancamento"); // Classe principal do item

        // Mapeia as propriedades da transação da API para as variáveis esperadas pelo seu HTML
        const tipoTransacaoNome = transacao.tipoTransacao?.nome?.toLowerCase() || 'despesa'; // Garante lowercase e fallback
        const categoriaNome = transacao.categoria?.nome || 'Sem categoria';
        const idTransacao = transacao.id_transacao; // ID da transação
        const descricaoTransacao = transacao.descricao;
        const valorTransacao = transacao.valor.toFixed(2);

        item.innerHTML = `
            <div class="item-info">
                <span class="tipo ${tipoTransacaoNome}">${tipoTransacaoNome === "receita" ? "Receita" : "Despesa"}</span>
                <span class="categoria">${categoriaNome}</span>
            </div>
            <span class="descricao">${descricaoTransacao}</span>
            <div class="exclui-item">
                <div class="valor ${tipoTransacaoNome}">R$ ${valorTransacao}</div>
                <i class="fa-solid fa-xmark" data-id="${idTransacao}" data-tipo="${tipoTransacaoNome}" data-descricao="${descricaoTransacao}"></i>
            </div>
        `;
        return item;
    }

    // SUA FUNÇÃO ORIGINAL, AGORA COM MELHORIAS E LOGS
    function atualizarListaLancamentos() {
        console.log("Chamando atualizarListaLancamentos()...");
        if (!window.transacoesParaFiltro || !listaLancamentos || !window.dataReferencia || !window.filtrarPorMes) {
            console.warn("Dependências globais para lancamentos.js ainda não estão prontas. Não é possível atualizar a lista.");
            listaLancamentos.innerHTML = `<p style="text-align:center; margin-top: 20px;">Carregando lançamentos...</p>`;
            return; // Sai se as dependências não estão prontas
        }

        // Filtra pelo mês atual global
        let transacoesMes = window.filtrarPorMes(window.transacoesParaFiltro, window.dataReferencia);
        console.log("Transações filtradas por mês:", transacoesMes);

        // Aplica filtro por tipo
        const tipoSelecionado = filtroTipo?.value; // Use optional chaining para segurança
        if (tipoSelecionado && tipoSelecionado !== "todos") {
            transacoesMes = transacoesMes.filter(t => t.tipoTransacao?.nome?.toLowerCase() === tipoSelecionado);
            console.log("Transações após filtro por tipo:", transacoesMes);
        }

        // Aplica filtro por categoria
        const categoriaSelecionada = filtroCategoria?.value; // Use optional chaining para segurança
        if (categoriaSelecionada && categoriaSelecionada !== "todas") {
            transacoesMes = transacoesMes.filter(t => (t.categoria?.nome || '').toLowerCase() === categoriaSelecionada.toLowerCase());
            console.log("Transações após filtro por categoria:", transacoesMes);
        }

        // Limpa e preenche a lista
        listaLancamentos.innerHTML = "";

        if (transacoesMes.length === 0) {
            listaLancamentos.innerHTML = `<p style="text-align:center; margin-top: 20px;">Nenhum lançamento encontrado para o mês/filtros selecionados.</p>`;
            return;
        }

        // Adicionando ordenação por data (do mais recente para o mais antigo)
        transacoesMes.sort((a, b) => {
            // Convertendo a string 'YYYY-MM-DD' para um objeto Date para comparação
            const dateA = new Date(a.data_transacao + 'T00:00:00');
            const dateB = new Date(b.data_transacao + 'T00:00:00');
            return dateB.getTime() - dateA.getTime();
        });

        transacoesMes.forEach(t => {
            const item = criarItemLancamento(t);
            listaLancamentos.appendChild(item);
        });
        console.log(`Lista de lançamentos atualizada com ${transacoesMes.length} itens.`);
    }

    // Eventos dos filtros
    if (filtroTipo) {
        filtroTipo.addEventListener("change", atualizarListaLancamentos);
        console.log("Listener de 'change' para filtroTipo adicionado.");
    }
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", atualizarListaLancamentos);
        console.log("Listener de 'change' para filtroCategoria adicionado.");
    }
    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener("click", () => {
            console.log("Botão 'Limpar Filtros' clicado.");
            if (filtroTipo) filtroTipo.value = "todos";
            if (filtroCategoria) filtroCategoria.value = "todas";
            window.popularFiltroCategorias(); // Repopula (garante que todas as categorias voltem)
            atualizarListaLancamentos(); // Atualiza a lista
        });
        console.log("Listener de 'click' para btnLimparFiltros adicionado.");
    }

    // Função para popular o filtro de categorias (SUA FUNÇÃO ORIGINAL GLOBAL)
    window.popularFiltroCategorias = function() {
        if (!filtroCategoria || !window.transacoesParaFiltro) {
            console.warn("Filtro de categoria ou transações globais não disponíveis para popular o filtro. Aguardando dados...");
            return;
        }

        // Obtém categorias de transacoesParaFiltro (que virão com .categoria?.nome)
        const categoriasExistentes = new Set(window.transacoesParaFiltro.map(t => t.categoria?.nome).filter(Boolean));
        filtroCategoria.innerHTML = `<option value="" disabled selected>Buscar por Categoria...</option><option value="todas">Todas as categorias</option>`;
        categoriasExistentes.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            filtroCategoria.appendChild(option);
        });
        console.log("Filtro de categorias populado.");
    };

    // --- EVENT LISTENERS PARA REAGIR À ATUALIZAÇÃO DOS DADOS GLOBAIS ---
    // Atualiza a lista quando os dados forem atualizados (carregados do banco ou modificados)
    document.addEventListener("transacoesAtualizadas", () => {
        console.log("Evento 'transacoesAtualizadas' recebido em lancamentos.js. Populando categorias e atualizando lançamentos.");
        window.popularFiltroCategorias(); // Popula categorias ao atualizar
        atualizarListaLancamentos(); // Chama sua função original
    });

    // Atualiza a lista quando o mês de referência global é alterado
    document.addEventListener("mesReferenciaGlobalAlterado", (event) => {
        console.log("Evento 'mesReferenciaGlobalAlterado' recebido em lancamentos.js. Nova data:", event.detail.novaDataReferencia);
        atualizarListaLancamentos(); // Chama sua função original
    });

    // Atualiza logo que carregar a página
    console.log("Realizando chamadas iniciais para popular categorias e atualizar lançamentos.");
    atualizarListaLancamentos(); // Sua chamada inicial, agora mais robusta
    window.popularFiltroCategorias(); // Sua chamada inicial global
});