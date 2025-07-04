let transacoesParaFiltro = JSON.parse(localStorage.getItem('minhasTransacoes')) || [
    { id: 1, tipo: "receita", valor: 500, data: "2025-06-05", categoria: "Salário", descricao: "Salário do mês" },
    { id: 2, tipo: "despesa", valor: 200, data: "2025-06-06", categoria: "Mercado", descricao: "Compras do mercado" },
    { id: 3, tipo: "despesa", valor: 80, data: "2025-06-07", category: "Transporte", descricao: "Combustível" },
    { id: 4, tipo: "receita", valor: 300, data: "2025-05-28", categoria: "Salário", descricao: "Adiantamento" },
    { id: 5, tipo: "despesa", valor: 150, data: "2025-06-10", categoria: "Mercado", descricao: "Feira da semana" },
    { id: 6, tipo: "despesa", valor: 80, data: "2025-04-30", categoria: "Lazer", descricao: "Cinema" },
    { id: 7, tipo: "receita", valor: 100, data: "2025-05-09", categoria: "Outros", descricao: "Presente" },
    { id: 8, tipo: "despesa", valor: 520.00, data: "2025-05-04", categoria: "Alimentação", descricao: "Supermercado grande" },
    { id: 9, tipo: "despesa", valor: 300.00, data: "2025-05-02", categoria: "Transporte", descricao: "Manutenção do carro" },
];

let dataReferencia = new Date();

let limitesGastos = JSON.parse(localStorage.getItem('limitesGastos')) || {};

function salvarTransacoes() {
    localStorage.setItem('minhasTransacoes', JSON.stringify(transacoesParaFiltro));
    document.dispatchEvent(new CustomEvent('transacoesAtualizadas'));
}

function salvarLimitesGastos() {
    localStorage.setItem('limitesGastos', JSON.stringify(limitesGastos));
    document.dispatchEvent(new CustomEvent('limitesAtualizadas'));
}

function abrirModalReceita() {
    Swal.fire({
        title: 'Nova Receita',
        html: `
            <div class="campo">
                <label for="descricao">Descrição</label>
                <input type="text" id="descricao" class="swal2-input input-custom">
            </div>

            <div class="linha">
                <div class="campo">
                    <label for="valor">Valor</label>
                    <input type="number" id="valor" class="swal2-input input-custom pequeno">
                </div>
                <div class="campo">
                    <label for="data">Data</label>
                    <input type="date" id="data" class="swal2-input input-custom pequeno">
                </div>
            </div>

            <div class="campo">
                <label for="categoria">Categoria</label>
                <select id="categoria" class="swal2-input input-custom">
                    <option value="" disabled selected>Buscar por Categoria...</option>
                    <option value="Empréstimos">Empréstimos</option>
                    <option value="Investimentos">Investimentos</option>
                    <option value="Outros">Outros</option>
                    <option value="Salário">Salário</option>
                </select>
            </div>
        `,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        background: '#ffffff',
        customClass: {
            title: 'popup-title',
            popup: 'popup-caixa'
        },
        focusConfirm: false,
        preConfirm: () => {
            const descricao = document.getElementById('descricao').value;
            const valor = document.getElementById('valor').value;
            const data = document.getElementById('data').value;
            const categoria = document.getElementById('categoria').value;

            if (!descricao || !valor || !data || !categoria) {
                Swal.showValidationMessage('Por favor, preencha todos os campos!');
                return false;
            }

            return {tipo: "receita", descricao, valor, data, categoria };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const novaTransacao = {
                id: Date.now(),
                tipo: result.value.tipo,
                valor: parseFloat(result.value.valor),
                data: result.value.data,
                categoria: result.value.categoria,
                descricao: result.value.descricao
            };
            transacoesParaFiltro.push(novaTransacao);
            salvarTransacoes();
            Swal.fire('Sucesso!', 'Transação adicionada com sucesso!', 'success');
        }
    });
}

function abrirModalDespesa() {
    Swal.fire({
        title: 'Nova Despesa',
        html: `
            <div class="campo">
                <label for="descricao">Descrição</label>
                <input type="text" id="descricao" class="swal2-input input-custom">
            </div>
            <div class="linha">
                <div class="campo">
                    <label for="valor">Valor</label>
                    <input type="number" id="valor" class="swal2-input input-custom pequeno">
                </div>
                <div class="campo">
                    <label for="data">Data</label>
                    <input type="date" id="data" class="swal2-input input-custom pequeno">
                </div>
            </div>
            <div class="campo">
                <label for="categoria">Categoria</label>
                <select id="categoria" class="swal2-input input-custom">
                    <option value="" disabled selected>Buscar por Categoria...</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Compras">Compras</option>
                    <option value="Contas">Contas</option>
                    <option value="Outros">Outros</option>
                    <option value="Mercado">Mercado</option>
                </select>
            </div>
        `,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        background: '#ffffff',
        customClass: {
            title: 'popup-title',
            popup: 'popup-caixa'
        },
        focusConfirm: false,
        preConfirm: () => {
            const descricao = document.getElementById('descricao').value;
            const valor = document.getElementById('valor').value;
            const data = document.getElementById('data').value;
            const categoria = document.getElementById('categoria').value;

            if (!descricao || !valor || !data || !categoria) {
                Swal.showValidationMessage('Por favor, preencha todos os campos!');
                return false;
            }

            return { tipo: "despesa", descricao, valor, data, categoria };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const novaTransacao = {
                id: Date.now(),
                tipo: result.value.tipo,
                valor: parseFloat(result.value.valor),
                data: result.value.data,
                categoria: result.value.categoria,
                descricao: result.value.descricao
            };
            transacoesParaFiltro.push(novaTransacao);
            salvarTransacoes();
            Swal.fire('Sucesso!', 'Transação adicionada com sucesso!', 'success');
        }
    });
}

function excluirTransacaoLocal(idTransacao) {
    transacoesParaFiltro = transacoesParaFiltro.filter(t => t.id != idTransacao);
    salvarTransacoes();
}

function filtrarPorMes(transacoes, dataRef) {
    const mes = dataRef.getMonth();
    const ano = dataRef.getFullYear();

    return transacoes.filter(t => {
        const [anoT, mesT, diaT] = t.data.split("-").map(Number);
        const dataTransacao = new Date(anoT, mesT - 1, diaT);

        return dataTransacao.getFullYear() === ano && dataTransacao.getMonth() === mes;
    });
}

function gerarCoresAleatorias(numCores) {
    const cores = [];
    const baseHue = 270;

    for (let i = 0; i < numCores; i++) {
        const hue = (baseHue + (i * 30)) % 360;
        const saturation = 60 + (i * 5) % 20;
        const lightness = 40 + (i * 5) % 30;

        cores.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return cores;
}

const spanMesAtual = document.getElementById("mes-atual");
const btnAnterior = document.getElementById("mes-anterior");
const btnPosterior = document.getElementById("mes-posterior");

if (spanMesAtual && btnAnterior && btnPosterior) {
    function atualizarMesExibicao() {
        const opcoes = { month: "long", year: "numeric" };
        let texto = dataReferencia.toLocaleDateString("pt-BR", opcoes);

        texto = texto.split(" ").map((word, index) => {
            if (index === 0) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            if (word.toLowerCase() === "de") {
                return "";
            }
            return word;
        }).join(" ").trim();

        spanMesAtual.textContent = texto;

        document.dispatchEvent(new CustomEvent('mesReferenciaGlobalAlterado', {
            detail: { novaDataReferencia: new Date(dataReferencia) }
        }));
    }

    btnAnterior.addEventListener("click", () => {
        dataReferencia.setMonth(dataReferencia.getMonth() - 1);
        atualizarMesExibicao();
        if (typeof atualizarLancamentos === 'function') { atualizarLancamentos(); }
        if (typeof atualizarRelatorios === 'function') { atualizarRelatorios(); }
        if (typeof atualizarDashboard === 'function') { atualizarDashboard(); }
    });

    btnPosterior.addEventListener("click", () => {
        dataReferencia.setMonth(dataReferencia.getMonth() + 1);
        atualizarMesExibicao();
        if (typeof atualizarLancamentos === 'function') { atualizarLancamentos(); }
        if (typeof atualizarRelatorios === 'function') { atualizarRelatorios(); }
        if (typeof atualizarDashboard === 'function') { atualizarDashboard(); }
    });

    document.addEventListener("DOMContentLoaded", atualizarMesExibicao);
}

const btnDespesa = document.getElementById('nova-despesa');
if (btnDespesa) {
    btnDespesa.addEventListener("click", abrirModalDespesa);
}

const btnReceita = document.getElementById('nova-receita');
if (btnReceita) {
    btnReceita.addEventListener("click", abrirModalReceita);
}

window.transacoesParaFiltro = transacoesParaFiltro;
window.dataReferencia = dataReferencia;
window.limitesGastos = limitesGastos;
window.salvarTransacoes = salvarTransacoes;
window.salvarLimitesGastos = salvarLimitesGastos;
window.excluirTransacaoLocal = excluirTransacaoLocal;
window.filtrarPorMes = filtrarPorMes;
window.gerarCoresAleatorias = gerarCoresAleatorias;