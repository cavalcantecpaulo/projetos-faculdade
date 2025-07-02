document.addEventListener("DOMContentLoaded", () => {
    const limitesListaContainer = document.getElementById('limitesListaContainer');
    const modalConfigLimites = document.getElementById('modalConfigLimites');
    const closeButton = modalConfigLimites ? modalConfigLimites.querySelector('.close-button') : null;
    const configLimitesForm = document.getElementById('configLimitesForm');
    const btnSalvarLimites = document.getElementById('btnSalvarLimites');

    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth();

    const spanMesAtualLimites = document.querySelector(".secao-limites .mes-atual");
    if (spanMesAtualLimites) {
        const opcoesMesAno = { month: "long", year: "numeric" };
        let textoMesAno = dataAtual.toLocaleDateString("pt-BR", opcoesMesAno);
        textoMesAno = textoMesAno.charAt(0).toUpperCase() + textoMesAno.slice(1);
        spanMesAtualLimites.textContent = textoMesAno;
    }

    function calcularGastosPorCategoriaNoMesAtual() {
        const gastosPorCategoria = {};

        if (!window.transacoesParaFiltro) {
            console.error("ERRO: window.transacoesParaFiltro não está definido. Verifique se global.js foi carregado corretamente ANTES de limites.js.");
            return {};
        }

        window.transacoesParaFiltro
            .filter(t => {
                const dataTransacao = new Date(t.data);
                const transacaoAno = dataTransacao.getFullYear();
                const transacaoMes = dataTransacao.getMonth();

                return t.tipo === 'despesa' &&
                       transacaoAno === anoAtual &&
                       transacaoMes === mesAtual;
            })
            .forEach(despesa => {
                gastosPorCategoria[despesa.categoria] = (gastosPorCategoria[despesa.categoria] || 0) + despesa.valor;
            });
        return gastosPorCategoria;
    }

    function preencherFormConfigLimites(categoriaParaFocar = null) {
        if (!configLimitesForm) {
            console.error("ERRO: configLimitesForm não encontrado. O modal de configuração de limites pode estar com problemas no HTML.");
            return;
        }
        configLimitesForm.innerHTML = '';
        
        console.log("Iniciando preencherFormConfigLimites()...");
        console.log("window.transacoesParaFiltro:", window.transacoesParaFiltro);

        if (!window.transacoesParaFiltro || window.transacoesParaFiltro.length === 0) {
             configLimitesForm.innerHTML = '<p>Nenhuma transação registrada. Adicione despesas primeiro para poder definir limites.</p>';
             if (btnSalvarLimites) btnSalvarLimites.style.display = 'none';
             console.warn("window.transacoesParaFiltro está vazio ou não definido. Não há categorias para listar.");
             return;
        }

        const categoriasDespesasTransacoes = [...new Set(window.transacoesParaFiltro
            .filter(t => t.tipo === 'despesa')
            .map(t => t.categoria)
        )];
        
        console.log("Categorias de despesas das transações:", categoriasDespesasTransacoes);

        if (window.limitesGastos) {
            Object.keys(window.limitesGastos).forEach(cat => {
                if (!categoriasDespesasTransacoes.includes(cat)) {
                    categoriasDespesasTransacoes.push(cat);
                }
            });
        } else {
            console.warn("window.limitesGastos não está definido ao preencher o formulário. Pode causar problemas se houver limites pré-existentes.");
        }
        
        console.log("Todas as categorias únicas (transações + limites):", categoriasDespesasTransacoes);

        if (categoriasDespesasTransacoes.length === 0) {
            configLimitesForm.innerHTML = '<p>Nenhuma categoria de despesa encontrada. Adicione despesas primeiro para poder definir limites.</p>';
            if (btnSalvarLimites) btnSalvarLimites.style.display = 'none';
            console.warn("Nenhuma categoria de despesa ou limite configurado. Formulário de limites vazio.");
            return;
        } else {
            if (btnSalvarLimites) btnSalvarLimites.style.display = 'block';
        }

        categoriasDespesasTransacoes.sort().forEach(categoria => {
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
            }
        }
        console.log("preencherFormConfigLimites() concluído.");
    }

    function renderizarLimitesGastos() {
        if (!limitesListaContainer) return;

        const gastosAtuaisPorCategoria = calcularGastosPorCategoriaNoMesAtual();
        limitesListaContainer.innerHTML = '';

        let temLimitesOuGastos = false;

        const todasCategoriasUnicas = new Set();
        Object.keys(gastosAtuaisPorCategoria).forEach(cat => todasCategoriasUnicas.add(cat));

        if (window.limitesGastos) {
            Object.keys(window.limitesGastos).forEach(cat => todasCategoriasUnicas.add(cat));
        } else {
            console.warn("window.limitesGastos não está definido.");
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
                    preencherFormConfigLimites();
                });
            }
            return;
        }

        categoriasOrdenadas.forEach(categoria => {
            const limite = (window.limitesGastos && window.limitesGastos[categoria]) || 0;
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

        limitesListaContainer.querySelectorAll('.btn-editar-limite').forEach(button => {
            button.addEventListener('click', (event) => {
                const categoriaParaEditar = event.currentTarget.dataset.categoria;
                if (modalConfigLimites) modalConfigLimites.style.display = 'block';
                preencherFormConfigLimites(categoriaParaEditar);
            });
        });

        if (!temLimitesOuGastos) {
             limitesListaContainer.innerHTML = '<p class="mensagem-sem-limites">Nenhuma despesa ou limite configurado para o mês atual. Adicione despesas ou defina limites para começar!</p>';
        }
    }

    if (modalConfigLimites && closeButton && configLimitesForm && btnSalvarLimites) {
        console.log("Elementos do modal encontrados e event listeners sendo adicionados.");

        closeButton.addEventListener('click', () => {
            console.log("Botão 'X' clicado. Escondendo modal...");
            modalConfigLimites.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modalConfigLimites) {
                console.log("Clique fora do modal detectado. Escondendo modal...");
                modalConfigLimites.style.display = 'none';
            }
        });

        btnSalvarLimites.addEventListener('click', () => {
            console.log("Botão 'Salvar Limites' clicado.");
            const inputs = configLimitesForm.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                const categoria = input.dataset.categoria;
                const valor = parseFloat(input.value);
                if (!isNaN(valor) && valor > 0) {
                    window.limitesGastos[categoria] = valor;
                } else {
                    delete window.limitesGastos[categoria];
                }
            });
            window.salvarLimitesGastos();
            console.log("Limites salvos. Escondendo modal...");
            modalConfigLimites.style.display = 'none';
        });
    } else {
        console.warn("AVISO: Alguns elementos essenciais do modal de configuração de limites não foram encontrados no DOM. Verifique o HTML.");
        console.log("modalConfigLimites:", modalConfigLimites);
        console.log("closeButton:", closeButton);
        console.log("configLimitesForm:", configLimitesForm);
        console.log("btnSalvarLimites:", btnSalvarLimites);
    }

    renderizarLimitesGastos();

    document.addEventListener('transacoesAtualizadas', () => {
        console.log('Evento transacoesAtualizadas recebido em limites.js. Atualizando limites...');
        if (spanMesAtualLimites) {
            const opcoesMesAno = { month: "long", year: "numeric" };
            let textoMesAno = dataAtual.toLocaleDateString("pt-BR", opcoesMesAno);
            textoMesAno = textoMesAno.charAt(0).toUpperCase() + textoMesAno.slice(1);
            spanMesAtualLimites.textContent = textoMesAno;
        }
        renderizarLimitesGastos();
    });

    document.addEventListener('limitesAtualizados', () => {
        console.log('Evento limitesAtualizados recebido em limites.js. Atualizando limites...');
        renderizarLimitesGastos();
    });
});