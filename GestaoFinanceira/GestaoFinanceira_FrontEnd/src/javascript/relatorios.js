// src/javascript/relatorios.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded para relatorios.js acionado.");

    const ctxDespesasCategorias = document.getElementById("graficoDespesasCategorias");
    const ctxReceitasCategorias = document.getElementById("graficoReceitasCategorias");
    const ctxFluxoDiario = document.getElementById("graficoFluxoDiario");

    let graficoDespesasCategoriasInstance = null;
    let graficoReceitasCategoriasInstance = null;
    let graficoFluxoDiarioInstance = null;

    // Função auxiliar para gerar cores aleatórias (pode ser movida para global.js se usada em outros lugares)
    function gerarCoresAleatorias(numCores) {
        const colors = [];
        for (let i = 0; i < numCores; i++) {
            const r = Math.floor(Math.random() * 200); // 0-199
            const g = Math.floor(Math.random() * 200); // 0-199
            const b = Math.floor(Math.random() * 200); // 0-199
            colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
        }
        return colors;
    }

    function atualizarGraficoDespesasCategorias(transacoesDoMes) {
        if (!ctxDespesasCategorias) {
            console.warn("Elemento 'graficoDespesasCategorias' não encontrado.");
            return;
        }

        const despesasPorCategoria = transacoesDoMes
            .filter(t => t.tipoTransacao?.nome?.toLowerCase() === 'despesa') // Acessa t.tipoTransacao.nome
            .reduce((acc, transacao) => {
                const categoriaNome = transacao.categoria?.nome || 'Outros'; // Acessa t.categoria.nome
                acc[categoriaNome] = (acc[categoriaNome] || 0) + transacao.valor;
                return acc;
            }, {});

        const labels = Object.keys(despesasPorCategoria);
        const data = Object.values(despesasPorCategoria);
        const backgroundColors = gerarCoresAleatorias(labels.length);

        if (graficoDespesasCategoriasInstance) {
            graficoDespesasCategoriasInstance.destroy();
        }

        graficoDespesasCategoriasInstance = new Chart(ctxDespesasCategorias.getContext('2d'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 30
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#3b0764',
                            font: {
                                size: 16,
                                family: 'Poppins'
                            }
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
        console.log("Gráfico de Despesas por Categoria atualizado.");
    }

    function atualizarGraficoReceitasCategorias(transacoesDoMes) {
        if (!ctxReceitasCategorias) {
            console.warn("Elemento 'graficoReceitasCategorias' não encontrado.");
            return;
        }

        const receitasPorCategoria = transacoesDoMes
            .filter(t => t.tipoTransacao?.nome?.toLowerCase() === 'receita') // Acessa t.tipoTransacao.nome
            .reduce((acc, transacao) => {
                const categoriaNome = transacao.categoria?.nome || 'Outros'; // Acessa t.categoria.nome
                acc[categoriaNome] = (acc[categoriaNome] || 0) + transacao.valor;
                return acc;
            }, {});

        const labels = Object.keys(receitasPorCategoria);
        const data = Object.values(receitasPorCategoria);
        const backgroundColors = gerarCoresAleatorias(labels.length);

        if (graficoReceitasCategoriasInstance) {
            graficoReceitasCategoriasInstance.destroy();
        }

        graficoReceitasCategoriasInstance = new Chart(ctxReceitasCategorias.getContext('2d'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 30
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#3b0764',
                            font: {
                                size: 16,
                                family: 'Poppins'
                            }
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
        console.log("Gráfico de Receitas por Categoria atualizado.");
    }

    function atualizarGraficoFluxoDiario(transacoesDoMes, dataAtual) {
        if (!ctxFluxoDiario) {
            console.warn("Elemento 'graficoFluxoDiario' não encontrado.");
            return;
        }

        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();

        const receitasDiarias = new Array(diasNoMes).fill(0);
        const despesasDiarias = new Array(diasNoMes).fill(0);
        const labelsDiarias = [];

        for (let i = 1; i <= diasNoMes; i++) {
            labelsDiarias.push(i);
        }

        transacoesDoMes.forEach(t => {
            // Acessa t.data_transacao, garantindo o formato correto para new Date
            const dataTransacao = new Date(t.data_transacao + 'T00:00:00'); 
            if (dataTransacao.getFullYear() === ano && dataTransacao.getMonth() === mes) {
                const dia = dataTransacao.getDate();
                const indice = dia - 1;

                // Acessa t.tipoTransacao.nome
                if (t.tipoTransacao?.nome?.toLowerCase() === 'receita') {
                    receitasDiarias[indice] += t.valor;
                } else if (t.tipoTransacao?.nome?.toLowerCase() === 'despesa') {
                    despesasDiarias[indice] += t.valor;
                }
            }
        });

        if (graficoFluxoDiarioInstance) {
            graficoFluxoDiarioInstance.destroy();
        }

        graficoFluxoDiarioInstance = new Chart(ctxFluxoDiario.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labelsDiarias,
                datasets: [{
                    label: 'Receitas',
                    data: receitasDiarias,
                    backgroundColor: '#32d400',
                    borderColor: '#32d400',
                    borderWidth: 1,
                }, {
                    label: 'Despesas',
                    data: despesasDiarias,
                    backgroundColor: '#db0000',
                    borderColor: '#db0000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 30
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#3b0764',
                            font: {
                                size: 20,
                                family: 'Poppins'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y || 0;
                                return `${label}: R$ ${value.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Dia do Mês'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
        console.log("Gráfico de Fluxo Diário atualizado.");
    }

    const tiposRelatorio = document.querySelectorAll('.selecao-relatorio .tipo-relatorio');

    const containerDespesas = document.querySelector('.grafico-container:has(#graficoDespesasCategorias)');
    const containerReceitas = document.querySelector('.grafico-container:has(#graficoReceitasCategorias)');
    const containerEntradasSaidas = document.querySelector('.grafico-container:has(#graficoFluxoDiario)');

    // Função global para ser chamada pelo global.js e pelos listeners locais
    window.atualizarRelatorios = function() {
        console.log("Chamando window.atualizarRelatorios()...");

        // Verifica se window.transacoesParaFiltro e window.dataReferencia estão disponíveis
        if (!window.transacoesParaFiltro || !window.dataReferencia || !window.filtrarPorMes) {
            console.warn("Dados globais (transacoesParaFiltro, dataReferencia, filtrarPorMes) não estão prontos. Relatórios não podem ser atualizados.");
            // Opcional: Mostrar uma mensagem de "Carregando..." nos gráficos
            if (ctxDespesasCategorias) ctxDespesasCategorias.innerHTML = '<p>Carregando dados...</p>';
            if (ctxReceitasCategorias) ctxReceitasCategorias.innerHTML = '<p>Carregando dados...</p>';
            if (ctxFluxoDiario) ctxFluxoDiario.innerHTML = '<p>Carregando dados...</p>';
            return;
        }

        const transacoesDoMes = window.filtrarPorMes(window.transacoesParaFiltro, window.dataReferencia);
        const tipoAtivo = document.querySelector('.selecao-relatorio .tipo-relatorio.ativo');
        const textoTipoAtivo = tipoAtivo ? tipoAtivo.textContent.trim() : 'Categorias';

        console.log("Atualizando relatório de:", textoTipoAtivo, "para o mês:", window.dataReferencia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }));

        // Esconde todos os containers primeiro
        if (containerDespesas) containerDespesas.style.display = 'none';
        if (containerReceitas) containerReceitas.style.display = 'none';
        if (containerEntradasSaidas) containerEntradasSaidas.style.display = 'none';

        // Mostra e atualiza apenas o relatório ativo
        if (textoTipoAtivo === 'Categorias') {
            if (containerDespesas) containerDespesas.style.display = 'block';
            if (containerReceitas) containerReceitas.style.display = 'block';
            atualizarGraficoDespesasCategorias(transacoesDoMes);
            atualizarGraficoReceitasCategorias(transacoesDoMes);
        } else if (textoTipoAtivo === 'Entradas x Saídas') {
            if (containerEntradasSaidas) containerEntradasSaidas.style.display = 'block';
            atualizarGraficoFluxoDiario(transacoesDoMes, window.dataReferencia);
        }
    };

    if (tiposRelatorio.length > 0) {
        tiposRelatorio.forEach(p => {
            p.addEventListener('click', function() {
                tiposRelatorio.forEach(item => item.classList.remove('ativo'));
                this.classList.add('ativo');
                window.atualizarRelatorios(); // Chama a função global de atualização
            });
        });

        // Chamada inicial para exibir o relatório padrão (Categorias)
        // Isso será executado apenas uma vez quando o DOM estiver pronto
        // Mas a atualização real ocorrerá quando os dados globais estiverem prontos via evento
        console.log("Preparando chamada inicial de relatórios.");
        // A primeira chamada será tratada pelo evento 'transacoesAtualizadas'
        // Mas se o evento já disparou, pode ser necessário uma chamada manual.
        // A maneira mais robusta é confiar nos eventos abaixo.
    }

    // --- EVENT LISTENERS PARA REAGIR À ATUALIZAÇÃO DOS DADOS GLOBAIS ---
    // Escuta o evento que global.js dispara quando as transações são carregadas/atualizadas
    document.addEventListener("transacoesAtualizadas", () => {
        console.log("Evento 'transacoesAtualizadas' recebido em relatorios.js. Atualizando relatórios.");
        window.atualizarRelatorios(); // Atualiza os gráficos quando os dados estiverem prontos
    });

    // Escuta o evento que global.js dispara quando o mês de referência é alterado
    document.addEventListener("mesReferenciaGlobalAlterado", (event) => {
        console.log("Evento 'mesReferenciaGlobalAlterado' recebido em relatorios.js. Nova data:", event.detail.novaDataReferencia);
        window.atualizarRelatorios(); // Atualiza os gráficos para o novo mês
    });

    // Para garantir que os relatórios carreguem caso o evento 'transacoesAtualizadas' já tenha disparado
    // antes de relatorios.js ter seus listeners registrados (cenário raro mas possível)
    if (window.transacoesParaFiltro && window.dataReferencia) {
        console.log("Dados globais já disponíveis na carga inicial. Atualizando relatórios imediatamente.");
        window.atualizarRelatorios();
    }
});