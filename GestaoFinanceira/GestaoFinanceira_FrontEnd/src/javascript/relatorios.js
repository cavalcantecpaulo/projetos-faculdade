document.addEventListener("DOMContentLoaded", () => {
    const ctxDespesasCategorias = document.getElementById("graficoDespesasCategorias");
    const ctxReceitasCategorias = document.getElementById("graficoReceitasCategorias");
    const ctxFluxoDiario = document.getElementById("graficoFluxoDiario");

    let graficoDespesasCategoriasInstance = null;
    let graficoReceitasCategoriasInstance = null;
    let graficoFluxoDiarioInstance = null;

    function atualizarGraficoDespesasCategorias(transacoesDoMes) {
        if (!ctxDespesasCategorias) return;

        const despesasPorCategoria = transacoesDoMes
            .filter(t => t.tipo === 'despesa')
            .reduce((acc, transacao) => {
                acc[transacao.categoria] = (acc[transacao.categoria] || 0) + transacao.valor;
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
    }

    function atualizarGraficoReceitasCategorias(transacoesDoMes) {
        if (!ctxReceitasCategorias) return;

        const receitasPorCategoria = transacoesDoMes
            .filter(t => t.tipo === 'receita')
            .reduce((acc, transacao) => {
                acc[transacao.categoria] = (acc[transacao.categoria] || 0) + transacao.valor;
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
    }

    function atualizarGraficoFluxoDiario(transacoesDoMes, dataAtual) {
        if (!ctxFluxoDiario) return;

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
            const dataTransacao = new Date(t.data + 'T00:00:00');
            if (dataTransacao.getFullYear() === ano && dataTransacao.getMonth() === mes) {
                const dia = dataTransacao.getDate();
                const indice = dia - 1;

                if (t.tipo === 'receita') {
                    receitasDiarias[indice] += t.valor;
                } else if (t.tipo === 'despesa') {
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
    }

    const tiposRelatorio = document.querySelectorAll('.selecao-relatorio .tipo-relatorio');

    const containerDespesas = document.querySelector('.grafico-container:has(#graficoDespesasCategorias)');
    const containerReceitas = document.querySelector('.grafico-container:has(#graficoReceitasCategorias)');
    const containerEntradasSaidas = document.querySelector('.grafico-container:has(#graficoFluxoDiario)');

    if (tiposRelatorio.length > 0) {
        tiposRelatorio.forEach(p => {
            p.addEventListener('click', function() {
                tiposRelatorio.forEach(item => item.classList.remove('ativo'));
                this.classList.add('ativo');
                atualizarRelatorios();
            });
        });

        window.atualizarRelatorios = function() {
            const transacoesDoMes = filtrarPorMes(transacoesParaFiltro, dataReferencia);
            const tipoAtivo = document.querySelector('.selecao-relatorio .tipo-relatorio.ativo');
            const textoTipoAtivo = tipoAtivo ? tipoAtivo.textContent.trim() : 'Categorias';

            console.log("Atualizando relatório de:", textoTipoAtivo, "para o mês:", dataReferencia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }));

            if (containerDespesas) containerDespesas.style.display = 'none';
            if (containerReceitas) containerReceitas.style.display = 'none';
            if (containerEntradasSaidas) containerEntradasSaidas.style.display = 'none';

            if (textoTipoAtivo === 'Categorias') {
                if (containerDespesas) containerDespesas.style.display = 'block';
                if (containerReceitas) containerReceitas.style.display = 'block';
                atualizarGraficoDespesasCategorias(transacoesDoMes);
                atualizarGraficoReceitasCategorias(transacoesDoMes);
            } else if (textoTipoAtivo === 'Entradas x Saídas') {
                if (containerEntradasSaidas) containerEntradasSaidas.style.display = 'block';
                atualizarGraficoFluxoDiario(transacoesDoMes, dataReferencia);
            }
        };

        atualizarRelatorios();
    }
});