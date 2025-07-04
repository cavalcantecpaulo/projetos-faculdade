document.addEventListener("DOMContentLoaded", () => {

    const ctxGraficoDashboard = document.getElementById("graficoDespesasCategoriasDashboard");
    let graficoDashboardDespesasInstance = null;

    const saldoGeralElement = document.getElementById("saldoGeral");
    const receitaMensalElement = document.getElementById("receitaMensal");
    const despesaMensalElement = document.getElementById("despesaMensal");

    function atualizarValoresFinanceiros(transacoesDoMes) {
        let totalReceitasMes = 0;
        let totalDespesasMes = 0;

        transacoesDoMes.forEach(t => {
            if (t.tipo === 'receita') {
                totalReceitasMes += t.valor;
            } else if (t.tipo === 'despesa') {
                totalDespesasMes += t.valor;
            }
        });

        let saldoGeralMes = totalReceitasMes - totalDespesasMes;

        if (saldoGeralElement) {
            saldoGeralElement.textContent = saldoGeralMes.toFixed(2);
            if (saldoGeralMes < 0) {
                saldoGeralElement.classList.add('negativo');
                saldoGeralElement.classList.remove('positivo');
            } else {
                saldoGeralElement.classList.add('positivo');
                saldoGeralElement.classList.remove('negativo');
            }
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
            .filter(t => t.tipo === 'despesa')
            .reduce((acc, transacao) => {
                acc[transacao.categoria] = (acc[transacao.categoria] || 0) + transacao.valor;
                return acc;
            }, {});

        const labels = Object.keys(despesasPorCategoria);
        const data = Object.values(despesasPorCategoria);
        const backgroundColors = window.gerarCoresAleatorias ? window.gerarCoresAleatorias(labels.length) : ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

        if (graficoDashboardDespesasInstance) {
            graficoDashboardDespesasInstance.destroy();
        }

        graficoDashboardDespesasInstance = new Chart(ctxGraficoDashboard.getContext('2d'), {
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
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#3b0764',
                            font: {
                                size: 14,
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

    const tbodyGastos = document.getElementById("tabelaGastos");

    function atualizarTabelaMaioresGastos(transacoesDoMes) {
        if (!tbodyGastos) return;

        tbodyGastos.innerHTML = "";

        const despesasOrdenadas = transacoesDoMes.filter(t => t.tipo === 'despesa')
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
                <td>${gasto.categoria}</td>
                <td>${formatarDataParaExibicao(gasto.data)}</td>
                <td>R$ ${gasto.valor.toFixed(2)}</td>
            `;
            tbodyGastos.appendChild(tr);
        });
    }

    const listaTransacoesRecentes = document.getElementById("listaTransacoes");

    function filtrarUltimos5Dias(transacoes) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return transacoes.filter(t => {
            const dataTransacao = new Date(t.data + 'T00:00:00');
            dataTransacao.setHours(0, 0, 0, 0);

            const diffDias = (hoje - dataTransacao) / (1000 * 60 * 60 * 24);
            return diffDias >= 0 && diffDias <= 4;
        });
    }

    function formatarDataParaExibicao(dataStr) {
        const data = new Date(dataStr + 'T00:00:00');
        return data.toLocaleDateString("pt-BR");
    }

    function mostrarTransacoesRecentes(transacoes) {
        if (!listaTransacoesRecentes) return;

        listaTransacoesRecentes.innerHTML = "";

        if (transacoes.length === 0) {
            listaTransacoesRecentes.innerHTML = `<li class="transacao-item" style="text-align: center;">Nenhuma transação recente.</li>`;
            return;
        }

        transacoes.sort((a, b) => {
            const dateA = new Date(a.data + 'T00:00:00');
            const dateB = new Date(b.data + 'T00:00:00');
            return dateB.getTime() - dateA.getTime();
        });

        transacoes.forEach(t => {
            const li = document.createElement("li");
            li.classList.add("transacao-item");

            li.innerHTML = `
                <div class="transacao-info">
                    <span class="transacao-tipo ${t.tipo === "receita" ? "transacao-receita" : "transacao-despesa"}">
                        ${t.tipo === "receita" ? "<i class='fa-solid fa-arrow-up-wide-short'></i> Receita" : "<i class='fa-solid fa-arrow-down-wide-short'></i> Despesa"}
                    </span>
                    <span>${t.categoria} – ${formatarDataParaExibicao(t.data)}</span>
                </div>
                <span><strong>R$ ${t.valor.toFixed(2)}</strong></span>
            `;
            listaTransacoesRecentes.appendChild(li);
        });
    }

    const btnAdicionarMeta = document.getElementById("btnAdicionarMeta");
    const inputMeta = document.getElementById("inputMeta");
    const formMeta = document.getElementById("formMeta");
    const resultadoMeta = document.getElementById("resultadoMeta");
    const infoMeta = document.querySelector(".meta-info");
    const barraProgresso = document.querySelector(".progresso");

    const META_KEY = "dashboardMetaDeReceita";

    if (btnAdicionarMeta && formMeta && resultadoMeta && infoMeta && barraProgresso && inputMeta) {

        function getReceitaUltimos5DiasParaMeta() {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const cincoDiasAtras = new Date(hoje);
            cincoDiasAtras.setDate(hoje.getDate() - 4);
            cincoDiasAtras.setHours(0, 0, 0, 0);

            if (!window.transacoesParaFiltro) {
                console.warn("transacoesParaFiltro não está disponível para cálculo da meta.");
                return 0;
            }

            return window.transacoesParaFiltro
                .filter(t => {
                    const dataTransacao = new Date(t.data + 'T00:00:00');
                    dataTransacao.setHours(0, 0, 0, 0);

                    return t.tipo === "receita" && dataTransacao.getTime() >= cincoDiasAtras.getTime();
                })
                .reduce((soma, t) => soma + t.valor, 0);
        }

        function atualizarExibicaoMeta(meta) {
            const atingido = getReceitaUltimos5DiasParaMeta();
            const percentual = Math.min((atingido / meta) * 100, 100);

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
                    inputMeta.value = metaValor.toFixed(2);
                    atualizarExibicaoMeta(metaValor);
                    formMeta.style.display = "none";
                    resultadoMeta.style.display = "block";
                    return true;
                }
            }
            formMeta.style.display = "none";
            resultadoMeta.style.display = "none";
            return false;
        }

        btnAdicionarMeta.addEventListener("click", () => {
            if (formMeta.style.display === "none") {
                formMeta.style.display = "block";
                resultadoMeta.style.display = "none";
                const metaSalva = localStorage.getItem(META_KEY);
                if (metaSalva) {
                    inputMeta.value = parseFloat(metaSalva).toFixed(2);
                } else {
                    inputMeta.value = '';
                }
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
    } else {
        console.warn("AVISO: Alguns elementos da funcionalidade de meta não foram encontrados no DOM. Verifique o HTML.");
        console.log("btnAdicionarMeta:", btnAdicionarMeta);
        console.log("inputMeta:", inputMeta);
        console.log("formMeta:", formMeta);
        console.log("resultadoMeta:", resultadoMeta);
        console.log("infoMeta:", infoMeta);
        console.log("barraProgresso:", barraProgresso);
    }

    window.atualizarDashboard = function() {
        console.log("Atualizando Dashboard...");

        if (typeof window.carregarTransacoes === 'function') {
            window.carregarTransacoes();
        }

        const transacoesMesAtual = window.filtrarPorMes ? window.filtrarPorMes(window.transacoesParaFiltro, window.dataReferencia) : [];

        atualizarValoresFinanceiros(transacoesMesAtual);

        atualizarGraficoDashboardDespesas(transacoesMesAtual);

        atualizarTabelaMaioresGastos(transacoesMesAtual);

        const ultimos5Dias = window.transacoesParaFiltro ? filtrarUltimos5Dias(window.transacoesParaFiltro) : [];
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

    window.atualizarDashboard();

    document.addEventListener('transacoesAtualizadas', () => {
        console.log('Evento transacoesAtualizadas recebido em dashboard.js. Atualizando Dashboard...');
        window.atualizarDashboard();
    });

    document.addEventListener('mesReferenciaGlobalAlterado', () => {
        console.log('Evento mesReferenciaGlobalAlterado recebido em dashboard.js. Atualizando Dashboard...');
        window.atualizarDashboard();
    });
});