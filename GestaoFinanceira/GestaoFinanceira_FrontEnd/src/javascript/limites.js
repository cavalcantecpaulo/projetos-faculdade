// src/javascript/limites.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded para limites.js acionado.");

    const limitesListaContainer = document.getElementById('limitesListaContainer');
    const modalConfigLimites = document.getElementById('modalConfigLimites');
    const closeButton = modalConfigLimites ? modalConfigLimites.querySelector('.close-button') : null;
    const configLimitesForm = document.getElementById('configLimitesForm');
    const btnSalvarLimites = document.getElementById('btnSalvarLimites');
    const spanMesAtualLimites = document.querySelector(".secao-limites .mes-atual");

    // Remove as variáveis de data "locais" e dependa de window.dataReferencia do global.js
    // const dataAtual = new Date();
    // const anoAtual = dataAtual.getFullYear();
    // const mesAtual = dataAtual.getMonth();

    // Função para atualizar o texto do mês de referência
    function atualizarMesReferenciaDisplay() {
        if (spanMesAtualLimites && window.dataReferencia) {
            const opcoesMesAno = { month: "long", year: "numeric" };
            let textoMesAno = window.dataReferencia.toLocaleDateString("pt-BR", opcoesMesAno);
            // Capitaliza a primeira letra do mês
            textoMesAno = textoMesAno.charAt(0).toUpperCase() + textoMesAno.slice(1);
            spanMesAtualLimites.textContent = textoMesAno;
            console.log("Mês de referência do limite atualizado para:", textoMesAno);
        } else {
            console.warn("Elemento spanMesAtualLimites ou window.dataReferencia não disponível para atualizar o display do mês.");
        }
    }

    // Adaptação para usar a nova estrutura de dados e a data de referência global
    function calcularGastosPorCategoriaNoMesReferencia() {
        const gastosPorCategoria = {};

        // Verifica se window.transacoesParaFiltro e window.dataReferencia estão definidos
        if (!window.transacoesParaFiltro || !window.dataReferencia || !window.filtrarPorMes) {
            console.warn("Dependências para calcularGastosPorCategoriaNoMesReferencia não estão prontas (transações, dataReferencia ou filtrarPorMes ausentes). Retornando objeto vazio.");
            return {};
        }

        // Usa a função global para filtrar transações pelo mês de referência
        const transacoesDoMesReferencia = window.filtrarPorMes(window.transacoesParaFiltro, window.dataReferencia);
        console.log("Transações do mês de referência para cálculo de limites:", transacoesDoMesReferencia);

        transacoesDoMesReferencia
            .filter(t => t.tipoTransacao?.nome?.toLowerCase() === 'despesa') // Acesso correto à propriedade 'nome' de 'tipoTransacao'
            .forEach(despesa => {
                const categoriaNome = despesa.categoria?.nome || 'Outros'; // Acesso correto à propriedade 'nome' de 'categoria'
                gastosPorCategoria[categoriaNome] = (gastosPorCategoria[categoriaNome] || 0) + despesa.valor;
            });
        console.log("Gastos por categoria no mês de referência calculados:", gastosPorCategoria);
        return gastosPorCategoria;
    }

    // Adaptação para usar a nova estrutura de dados
    function preencherFormConfigLimites(categoriaParaFocar = null) {
        if (!configLimitesForm) {
            console.error("ERRO: configLimitesForm não encontrado. O modal de configuração de limites pode estar com problemas no HTML.");
            return;
        }
        configLimitesForm.innerHTML = ''; // Limpa o formulário antes de preencher
        
        console.log("Iniciando preencherFormConfigLimites()...");
        console.log("window.transacoesParaFiltro:", window.transacoesParaFiltro);

        if (!window.transacoesParaFiltro || window.transacoesParaFiltro.length === 0) {
            configLimitesForm.innerHTML = '<p>Nenhuma transação registrada. Adicione despesas primeiro para poder definir limites.</p>';
            if (btnSalvarLimites) btnSalvarLimites.style.display = 'none';
            console.warn("window.transacoesParaFiltro está vazio ou não definido. Não há categorias para listar no formulário de limites.");
            return;
        }

        // Coleta todas as categorias únicas de despesas das transações
        const categoriasDespesasTransacoes = new Set(window.transacoesParaFiltro
            .filter(t => t.tipoTransacao?.nome?.toLowerCase() === 'despesa') // Acesso correto
            .map(t => t.categoria?.nome) // Acesso correto
            .filter(Boolean) // Filtra valores nulos/undefined/vazios
        );
        
        console.log("Categorias de despesas das transações (base):", Array.from(categoriasDespesasTransacoes));

        // Adiciona categorias dos limites já existentes que podem não ter transações no mês atual
        if (window.limitesGastos) {
            Object.keys(window.limitesGastos).forEach(cat => {
                categoriasDespesasTransacoes.add(cat);
            });
        } else {
            console.warn("window.limitesGastos não está definido ao preencher o formulário de limites. Pode causar problemas se houver limites pré-existentes.");
        }
        
        const categoriasUnicasOrdenadas = Array.from(categoriasDespesasTransacoes).sort((a, b) => a.localeCompare(b));
        console.log("Todas as categorias únicas (transações + limites) ordenadas:", categoriasUnicasOrdenadas);

        if (categoriasUnicasOrdenadas.length === 0) {
            configLimitesForm.innerHTML = '<p>Nenhuma categoria de despesa encontrada. Adicione despesas primeiro para poder definir limites.</p>';
            if (btnSalvarLimites) btnSalvarLimites.style.display = 'none';
            console.warn("Nenhuma categoria de despesa ou limite configurado. Formulário de limites vazio.");
            return;
        } else {
            if (btnSalvarLimites) btnSalvarLimites.style.display = 'block';
        }

        categoriasUnicasOrdenadas.forEach(categoria => {
            const limiteAtual = (window.limitesGastos && window.limitesGastos[categoria]) || 0;
            const inputHtml = `
                <div class="form-group-limite">
                    <label for="limite-${categoria}">${categoria}:</label>
                    <input type="number" id="limite-${categoria}" data-categoria="${categoria}" 
                            value="${limiteAtual > 0 ? limiteAtual.toFixed(2) : ''}" 
                            placeholder="R$ 0.00" min="0" step="0.01">
                </div>
            `;
            configLimitesForm.innerHTML += inputHtml;
        });

        if (categoriaParaFocar) {
            const inputFoco = document.getElementById(`limite-${categoriaParaFocar}`);
            if (inputFoco) {
                inputFoco.focus();
                inputFoco.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log(`Focando no input da categoria: ${categoriaParaFocar}`);
            }
        }
        console.log("preencherFormConfigLimites() concluído.");
    }

    // Torna a função global para ser acessível por global.js e outros módulos
    window.renderizarLimitesGastos = function() {
        if (!limitesListaContainer) {
            console.warn("Elemento 'limitesListaContainer' não encontrado.");
            return;
        }

        console.log("Iniciando renderizarLimitesGastos()...");

        // Verifica se os dados globais essenciais estão disponíveis antes de tentar renderizar
        if (!window.transacoesParaFiltro || !window.dataReferencia || !window.limitesGastos) {
            console.warn("Dados globais (transacoesParaFiltro, dataReferencia, limitesGastos) não estão prontos. Não é possível renderizar limites ainda.");
            limitesListaContainer.innerHTML = '<p class="mensagem-sem-limites">Carregando dados de limites...</p>';
            return;
        }

        const gastosAtuaisPorCategoria = calcularGastosPorCategoriaNoMesReferencia();
        limitesListaContainer.innerHTML = ''; // Limpa o container antes de adicionar os itens

        let temLimitesOuGastos = false;

        const todasCategoriasUnicas = new Set();
        Object.keys(gastosAtuaisPorCategoria).forEach(cat => todasCategoriasUnicas.add(cat));
        
        // Adiciona as categorias que têm limite definido, mesmo que não haja gasto no mês
        if (window.limitesGastos) {
            Object.keys(window.limitesGastos).forEach(cat => todasCategoriasUnicas.add(cat));
        } else {
            console.warn("window.limitesGastos não está definido ao renderizar limites.");
        }

        const categoriasOrdenadas = Array.from(todasCategoriasUnicas).sort();

        if (categoriasOrdenadas.length === 0) {
            limitesListaContainer.innerHTML = `
                <p class="mensagem-sem-limites">Nenhuma despesa ou limite configurado para o mês atual.</p>
                <button id="btnAddPrimeiroLimite" class="btn-primary">Adicionar Primeiro Limite</button>
            `;
            const btnAddPrimeiroLimite = document.getElementById('btnAddPrimeiroLimite');
            if (btnAddPrimeiroLimite && modalConfigLimites) {
                btnAddPrimeiroLimite.addEventListener('click', () => {
                    console.log("Botão 'Adicionar Primeiro Limite' clicado.");
                    modalConfigLimites.style.display = 'block';
                    preencherFormConfigLimites(); // Preenche o formulário para adicionar novos limites
                });
            }
            console.log("Nenhum limite ou gasto para renderizar. Exibindo botão para adicionar.");
            return;
        }

        categoriasOrdenadas.forEach(categoria => {
            const limite = window.limitesGastos[categoria] || 0; // Se não tem limite, considera 0
            const gastoAtual = gastosAtuaisPorCategoria[categoria] || 0;
            const porcentagem = limite > 0 ? (gastoAtual / limite) * 100 : 0;

            const classeExcedido = (limite > 0 && gastoAtual > limite) ? 'limite-excedido' : '';

            const limiteFormatado = limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const gastoFormatado = gastoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const itemHtml = `
                <div class="limite-item ${classeExcedido}">
                    <div class="limite-info">
                        <p class="categoria-nome">${categoria}</p>
                        <p class="limite-valores">${gastoFormatado} de ${limiteFormatado}</p>
                    </div>
                    <div class="limite-barra-container">
                        <div class="barra-progresso">
                            <div class="progresso-preenchido" style="width: ${Math.min(porcentagem, 100)}%;"></div>
                            ${porcentagem > 100 ? '<div class="alerta-excedido">! EXCEDIDO</div>' : ''}
                        </div>
                        <button class="btn-editar-limite" data-categoria="${categoria}" title="Definir/Editar Limite">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            limitesListaContainer.innerHTML += itemHtml;
            temLimitesOuGastos = true;
        });

        // Adiciona event listeners aos botões de edição após eles serem criados no DOM
        limitesListaContainer.querySelectorAll('.btn-editar-limite').forEach(button => {
            button.addEventListener('click', (event) => {
                const categoriaParaEditar = event.currentTarget.dataset.categoria;
                if (modalConfigLimites) modalConfigLimites.style.display = 'block';
                preencherFormConfigLimites(categoriaParaEditar);
            });
        });

        if (!temLimitesOuGastos) {
            // Este bloco pode ser redundante se o 'if (categoriasOrdenadas.length === 0)' já for tratado acima,
            // mas mantemos por segurança caso a lógica mude.
            limitesListaContainer.innerHTML = `
                <p class="mensagem-sem-limites">Nenhuma despesa ou limite configurado para o mês atual. Adicione despesas ou defina limites para começar!</p>
                <button id="btnAddPrimeiroLimite" class="btn-primary">Adicionar Primeiro Limite</button>
            `;
            const btnAddPrimeiroLimite = document.getElementById('btnAddPrimeiroLimite');
            if (btnAddPrimeiroLimite && modalConfigLimites) {
                btnAddPrimeiroLimite.addEventListener('click', () => {
                    console.log("Botão 'Adicionar Primeiro Limite' clicado.");
                    modalConfigLimites.style.display = 'block';
                    preencherFormConfigLimites();
                });
            }
        }
        console.log("renderizarLimitesGastos() concluído.");
    }

    // Configuração e eventos do modal
    if (modalConfigLimites && closeButton && configLimitesForm && btnSalvarLimites) {
        console.log("Elementos do modal de limites encontrados e event listeners sendo adicionados.");

        closeButton.addEventListener('click', () => {
            console.log("Botão 'X' clicado no modal de limites. Escondendo modal...");
            modalConfigLimites.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modalConfigLimites) {
                console.log("Clique fora do modal de limites detectado. Escondendo modal...");
                modalConfigLimites.style.display = 'none';
            }
        });

        btnSalvarLimites.addEventListener('click', async () => { // Marcado como async para usar await
            console.log("Botão 'Salvar Limites' clicado.");
            const novosLimites = {};
            const inputs = configLimitesForm.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                const categoria = input.dataset.categoria;
                const valor = parseFloat(input.value);
                // Considera 0 como um limite válido (que significa sem limite na prática, ou para 'remover')
                // A sua lógica original era `valor > 0`, agora `valor >= 0`
                if (!isNaN(valor) && valor >= 0) { 
                    novosLimites[categoria] = valor;
                } else if (isNaN(valor) || valor < 0) {
                    // Se o campo estiver vazio ou negativo, significa que o limite para essa categoria deve ser removido
                    // ou não definido. Não o incluímos nos novosLimites para salvar.
                    console.log(`Categoria '${categoria}' com valor inválido ou vazio (${input.value}). Não será incluída nos limites.`);
                }
            });

            console.log("Novos limites a serem processados para salvar:", novosLimites);

            try {
                // Chama a função global para salvar os limites.
                // Esta função (window.salvarLimitesGastos) DEVE ser definida em global.js
                // e ser responsável por fazer a chamada à API.
                if (window.salvarLimitesGastos) {
                    // Passa o objeto 'novosLimites' como argumento para a função global
                    await window.salvarLimitesGastos(novosLimites); 
                    console.log("Tentativa de salvar limites via window.salvarLimitesGastos() concluída.");
                    // global.js deve disparar 'limitesAtualizados' após o sucesso
                } else {
                    console.error("ERRO: Função window.salvarLimitesGastos não está definida em global.js. Os limites não serão salvos na persistência.");
                    Swal.fire('Erro!', 'A função para salvar limites não foi encontrada. Verifique global.js.', 'error');
                }
            } catch (error) {
                console.error("Erro inesperado ao chamar window.salvarLimitesGastos:", error);
                Swal.fire('Erro!', `Ocorreu um erro ao tentar salvar os limites: ${error.message || error}`, 'error');
            } finally {
                modalConfigLimites.style.display = 'none'; // Sempre esconde o modal após a tentativa
            }
        });
    } else {
        console.warn("AVISO: Alguns elementos essenciais do modal de configuração de limites não foram encontrados no DOM. Verifique o HTML.");
        console.log("modalConfigLimites:", modalConfigLimites);
        console.log("closeButton:", closeButton);
        console.log("configLimitesForm:", configLimitesForm);
        console.log("btnSalvarLimites:", btnSalvarLimites);
    }

    // --- EVENT LISTENERS PARA REAGIR À ATUALIZAÇÃO DOS DADOS GLOBAIS ---
    // Atualiza a exibição do mês e a lista de limites quando as transações são carregadas/atualizadas
    document.addEventListener('transacoesAtualizadas', () => {
        console.log('Evento transacoesAtualizadas recebido em limites.js. Atualizando display do mês e renderizando limites...');
        atualizarMesReferenciaDisplay();
        window.renderizarLimitesGastos();
    });

    // Atualiza a lista de limites quando os próprios limites são salvos/atualizados (via API/global.js)
    document.addEventListener('limitesAtualizados', () => {
        console.log('Evento limitesAtualizados recebido em limites.js. Re-renderizando limites...');
        window.renderizarLimitesGastos();
        // Também preenche o formulário para garantir que os valores estejam atualizados ao reabrir
        preencherFormConfigLimites(); 
    });

    // Reage quando o mês de referência global é alterado (pelos botões de navegação de mês)
    document.addEventListener("mesReferenciaGlobalAlterado", (event) => {
        console.log("Evento 'mesReferenciaGlobalAlterado' recebido em limites.js. Nova data:", event.detail.novaDataReferencia);
        atualizarMesReferenciaDisplay();
        window.renderizarLimitesGastos(); // Atualiza os limites para o novo mês
    });

    // Chamada inicial para renderizar os limites na primeira carga da página
    // Isso é útil se os dados já estiverem disponíveis (ex: do cache ou carregamento rápido)
    // Se não estiverem, os event listeners acima se encarregarão da renderização posterior.
    if (window.transacoesParaFiltro && window.limitesGastos && window.dataReferencia) {
        console.log("Dados globais já disponíveis na carga inicial de limites. Renderizando imediatamente.");
        atualizarMesReferenciaDisplay();
        window.renderizarLimitesGastos();
    } else {
        console.log("Aguardando dados globais (transacoesParaFiltro, limitesGastos, dataReferencia) para a primeira renderização de limites...");
    }
});