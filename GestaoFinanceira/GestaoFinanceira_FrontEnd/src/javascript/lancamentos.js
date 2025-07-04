document.addEventListener("DOMContentLoaded", () => {
    const filtroTipo = document.getElementById("filtro-tipo");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const listaLancamentos = document.getElementById("listaLancamentos");
    const btnLimparFiltros = document.getElementById("btnLimparFiltros");
    const btnNovoLancamento = document.getElementById('novo-lancamento');

    function popularFiltroCategorias() {
        if (!filtroCategoria) return;

        if (filtroCategoria.options.length > 0 && filtroCategoria.options[0].value === "") {
             while (filtroCategoria.options.length > 1) {
                filtroCategoria.remove(1);
            }
        } else {
             filtroCategoria.innerHTML = '<option value="" selected>Todas as categorias</option>';
        }


        const categoriasDasTransacoes = window.transacoesParaFiltro
            ? [...new Set(window.transacoesParaFiltro.map(t => t.categoria))]
            : [];
        
        const categoriasReceitaModal = ["Empréstimos", "Investimentos", "Outros", "Salário"];
        const categoriasDespesaModal = ["Alimentação", "Transporte", "Moradia", "Saúde", "Educação", "Lazer", "Compras", "Contas", "Outros", "Mercado"];
        
        const todasCategoriasUnicas = [...new Set([...categoriasDasTransacoes, ...categoriasReceitaModal, ...categoriasDespesaModal])];

        todasCategoriasUnicas.sort((a, b) => a.localeCompare(b));

        todasCategoriasUnicas.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria;
            option.textContent = categoria;
            filtroCategoria.appendChild(option);
        });
    }

    if (btnNovoLancamento) {
        btnNovoLancamento.addEventListener("click", () => {
            Swal.fire({
                title: 'Qual tipo de lançamento?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Receita',
                denyButtonText: 'Despesa',
                cancelButtonText: 'Cancelar',
                background: '#ffffff',
                customClass: {
                    popup: 'popup-caixa',
                    title: 'titulo-personalizado',
                    confirmButton: 'botao-confirmar-personalizado',
                    denyButton: 'botao-negar-personalizado'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    abrirModalReceita();
                } else if (result.isDenied) {
                    abrirModalDespesa();
                }
            });
        });
    }

    function aplicarFiltros(transacoes) {
        const tipoSelecionado = filtroTipo.value;
        const categoriaSelecionada = filtroCategoria.value;

        return transacoes.filter(t => {
            const tipoValido = (tipoSelecionado === "" || tipoSelecionado === "todos") || t.tipo === tipoSelecionado;
            const categoriaValida = (categoriaSelecionada === "" || categoriaSelecionada === "todas") || t.categoria === categoriaSelecionada;
            return tipoValido && categoriaValida;
        });
    }

    function exibirLancamentos(transacoes) {
        if (!listaLancamentos) return;

        listaLancamentos.innerHTML = "";

        if (transacoes.length === 0) {
            listaLancamentos.innerHTML = `
                <div class="mensagem-vazia">
                    <span><i class="fa-solid fa-circle-exclamation"></i></span>
                    <p class="vazio">Nenhuma movimentação no período.</p>
                </div>
            `;
            return;
        }

        transacoes.sort((a, b) => {
            const dateA = new Date(a.data + 'T00:00:00');
            const dateB = new Date(b.data + 'T00:00:00');
            return dateB.getTime() - dateA.getTime();
        });


        transacoes.forEach(t => {
            const item = document.createElement("div");
            item.classList.add("item-lancamento");

            item.innerHTML = `
                <div class="item-info">
                    <span class="tipo ${t.tipo}">${t.tipo === "receita" ? "Receita" : "Despesa"}</span>
                    <span class="categoria">${t.categoria}</span>
                </div>
                <span class="descricao">${t.descricao}</span>
                <div class="exclui-item">
                    <div class="valor ${t.tipo}">R$ ${t.valor.toFixed(2)}</div>
                    <i class="fa-solid fa-xmark" data-id="${t.id}" data-tipo="${t.tipo}" data-descricao="${t.descricao}"></i>
                </div>
            `;
            listaLancamentos.appendChild(item);
        });

        listaLancamentos.querySelectorAll('.fa-xmark').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const idTransacao = event.target.dataset.id;
                const tipoTransacao = event.target.dataset.tipo;
                const descricaoTransacao = event.target.dataset.descricao;

                Swal.fire({
                    title: 'Tem certeza?',
                    text: `Você deseja excluir esta ${tipoTransacao}: "${descricaoTransacao}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Excluir',
                    cancelButtonText: 'Cancelar',
                    background: '#ffffff',
                    customClass: {
                        popup: 'popup-caixa',
                        title: 'titulo-personalizado',
                        confirmButton: 'botao-negar-personalizado', 
                        cancelButton: 'botao-confirmar-personalizado' 
                    }
                }).then(async (result) => { 
                    if (result.isConfirmed) {
                        if (window.excluirTransacaoLocal) {
                            try {
                                await window.excluirTransacaoLocal(idTransacao);
                                Swal.fire(
                                    'Excluído!',
                                    `A ${tipoTransacao} foi excluída com sucesso.`,
                                    'success'
                                );
                                window.atualizarLancamentos();
                            } catch (error) {
                                console.error('Erro ao excluir transação:', error);
                                Swal.fire(
                                    'Erro!',
                                    `Ocorreu um erro ao excluir a ${tipoTransacao}.`,
                                    'error'
                                );
                            }
                        } else {
                            console.error("Função 'excluirTransacaoBackend' não definida.");
                            Swal.fire(
                                'Erro!',
                                'A função de exclusão não está disponível.',
                                'error'
                            );
                        }
                    }
                });
            });
        });
    }

    window.atualizarLancamentos = function() {
        console.log("Atualizando Lançamentos para o mês:", dataReferencia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }));
        const filtradasPorMes = window.filtrarPorMes ? window.filtrarPorMes(window.transacoesParaFiltro, window.dataReferencia) : [];
        const filtradas = aplicarFiltros(filtradasPorMes);
        exibirLancamentos(filtradas);
    };

    if (filtroTipo) filtroTipo.addEventListener("change", window.atualizarLancamentos);
    if (filtroCategoria) filtroCategoria.addEventListener("change", window.atualizarLancamentos);

    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener("click", () => {
            if (filtroTipo) filtroTipo.value = "";
            if (filtroCategoria) filtroCategoria.value = "";
            window.atualizarLancamentos();
        });
    }

    popularFiltroCategorias();
    
    window.atualizarLancamentos();

    document.addEventListener('transacoesAtualizadas', () => {
        console.log('Evento transacoesAtualizadas recebido em lancamentos.js. Atualizando lista e categorias...');
        popularFiltroCategorias();
        window.atualizarLancamentos();
    });
});