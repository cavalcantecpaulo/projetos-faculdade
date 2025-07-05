import { buscarTransacoes, salvarTransacao, excluirTransacao, atualizarTransacao } from './api.js';

const mapaCategoria = {
    "Alimentação": 1,
    "Transporte": 2,
    "Moradia": 3,
    "Saúde": 4,
    "Educação": 5,
    "Lazer": 6,
    "Compras": 7,
    "Contas": 8,
    "Mercado": 9,
    "Empréstimos": 10,
    "Investimentos": 11,
    "Salário": 12,
    "Outros": 13
};

const mapaTipoTransacao = {
    "receita": 1,
    "despesa": 2
};

let transacoesParaFiltro = [];

let dataReferencia = new Date();

let limitesGastos = JSON.parse(localStorage.getItem('limitesGastos')) || {};

async function carregarTransacoesDoBanco() {
  try {
    const transacoes = await buscarTransacoes();

    // // Ajuste para garantir que tipoTransacao.nome esteja sempre presente
    // transacoes.forEach(t => {
    //   if (!t.tipoTransacao?.nome && t.tipo) {
    //     t.tipoTransacao = { nome: t.tipo };
    //   }
    // });

    transacoesParaFiltro = transacoes;
    window.transacoesParaFiltro = transacoes;

    console.log("Transações carregadas (ajustadas):", transacoes);
    document.dispatchEvent(new CustomEvent('transacoesAtualizadas'));
  } catch (e) {
    console.error("Erro ao carregar transações:", e);
    Swal.fire('Erro!', 'Não foi possível carregar as transações.', 'error');
  }
}


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
                    <input type="number" id="valor" class="swal2-input input-custom pequeno" step="0.01" min="0">
                </div>
                <div class="campo">
                    <label for="data_transacao">Data</label>
                    <input type="date" id="data" class="swal2-input input-custom pequeno">
                </div>
            </div>
            <div class="campo">
                <label for="categoria">Categoria</label>
                <select id="categoria" class="swal2-input input-custom" required>
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
            const descricao = document.getElementById('descricao').value.trim();
            const valor = parseFloat(document.getElementById('valor').value);
            const data = document.getElementById('data').value;
            const categoria = document.getElementById('categoria').value;

            if (!descricao || isNaN(valor) || valor <= 0 || !data || !categoria) {
                Swal.showValidationMessage('Por favor, preencha todos os campos corretamente!');
                return false;
            }

            return {
                tipo: "receita",
                descricao,
                valor,
                data_transacao: data,
                categoria: { id_categoria: mapaCategoria[categoria] },
                tipoTransacao: { id_tipo_transacao: mapaTipoTransacao["receita"] },
                usuario: { id_usuario: 1 }
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                console.log("Objeto Enviado:", result.value);
                await salvarTransacao(result.value);
                await carregarTransacoesDoBanco();
                Swal.fire('Sucesso!', 'Receita salva com sucesso!', 'success');
            } catch (err) {
                Swal.fire('Erro!', 'Não foi possível salvar a receita.', 'error');
                console.error(err);
            }
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
                    <input type="number" id="valor" class="swal2-input input-custom pequeno" step="0.01" min="0">
                </div>
                <div class="campo">
                    <label for="data_transacao">Data</label>
                    <input type="date" id="data" class="swal2-input input-custom pequeno">
                </div>
            </div>
            <div class="campo">
                <label for="categoria">Categoria</label>
                <select id="categoria" class="swal2-input input-custom" required>
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
            const descricao = document.getElementById('descricao').value.trim();
            const valor = parseFloat(document.getElementById('valor').value);
            const data = document.getElementById('data').value;
            const categoria = document.getElementById('categoria').value;

            if (!descricao || isNaN(valor) || valor <= 0 || !data || !categoria) {
                Swal.showValidationMessage('Por favor, preencha todos os campos corretamente!');
                return false;
            }

            return {
                tipo: "despesa",
                descricao,
                valor,
                data_transacao: data,
                categoria: { id_categoria: mapaCategoria[categoria] },
                tipoTransacao: { id_tipo_transacao: mapaTipoTransacao["despesa"] },
                usuario: { id_usuario: 1 }
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                console.log("Objeto enviado:", result.value);
                await salvarTransacao(result.value);
                await carregarTransacoesDoBanco();
                Swal.fire('Sucesso!', 'Despesa salva com sucesso!', 'success');
            } catch (err) {
                Swal.fire('Erro!', 'Não foi possível salvar a despesa.', 'error');
                console.error(err);
            }
        }
    });
}

async function editarTransacao(transacao) {
    try {
        await atualizarTransacao(transacao);
        await carregarTransacoesDoBanco();
        Swal.fire('Atualizado!', 'Transação editada com sucesso.', 'success');
    } catch (error) {
        Swal.fire('Erro!', 'Falha ao atualizar.', 'error');
    }
}

async function excluirTransacaoDoBanco(id) {
    try {
        await excluirTransacao(id);
        await carregarTransacoesDoBanco();
        Swal.fire('Excluído!', 'Transação removida com sucesso.', 'success');
    } catch (error) {
        Swal.fire('Erro!', 'Não foi possível excluir.', 'error');
    }
}

function filtrarPorMes(transacoes, dataRef) {
    const mes = dataRef.getMonth();
    const ano = dataRef.getFullYear();

    console.log("👉 Mês e ano de referência:", mes + 1, ano); // +1 porque getMonth() retorna 0-indexado
    console.log("👉 Total de transações recebidas:", transacoes.length);

    const filtradas = transacoes.filter(t => {
        const [anoT, mesT, diaT] = t.data_transacao.split("-").map(Number);
        const dataTransacao = new Date(anoT, mesT - 1, diaT);

        const corresponde = dataTransacao.getFullYear() === ano && dataTransacao.getMonth() === mes;

        console.log(`• Transação: ${t.descricao} | Data: ${t.data_transacao} | Mês ${mesT} === ${mes + 1}? ${corresponde}`);

        return corresponde;
    });

    console.log(" Transações filtradas:", filtradas);
    return filtradas;
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
        if (typeof atualizarLancamentos === 'function') atualizarLancamentos();
        if (typeof atualizarRelatorios === 'function') atualizarRelatorios();
        if (typeof atualizarDashboard === 'function') atualizarDashboard();
    });

    btnPosterior.addEventListener("click", () => {
        dataReferencia.setMonth(dataReferencia.getMonth() + 1);
        atualizarMesExibicao();
        if (typeof atualizarLancamentos === 'function') atualizarLancamentos();
        if (typeof atualizarRelatorios === 'function') atualizarRelatorios();
        if (typeof atualizarDashboard === 'function') atualizarDashboard();
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
window.excluirTransacaoLocal = excluirTransacaoDoBanco;
window.filtrarPorMes = filtrarPorMes;
window.gerarCoresAleatorias = gerarCoresAleatorias;
window.carregarTransacoesDoBanco = carregarTransacoesDoBanco;
window.editarTransacao = editarTransacao;

document.addEventListener("DOMContentLoaded", async () => {
    await carregarTransacoesDoBanco();
});
