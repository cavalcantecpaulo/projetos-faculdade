const urlApiTransacoes = "http://localhost:8080/api/v1/transacoes";
// NOVA URL para a API de limites
const urlApiLimites = "http://localhost:8080/api/v1/limites"; // Exemplo, ajuste conforme sua API

export async function buscarTransacoes() {
    const resp = await fetch(urlApiTransacoes);
    const data = await resp.json();

    return data.map(t => ({
        id_transacao: t.id_transacao,
        descricao: t.descricao,
        valor: t.valor,
        data_transacao: t.data_transacao,
        tipoTransacao: {
            id_tipo_transacao: t.tipoTransacao?.id_tipo_transacao,
            nome: t.tipoTransacao?.nome
        },
        categoria: {
            id_categoria: t.categoria?.id_categoria,
            nome: t.categoria?.nome
        },
        usuario: {
            id_usuario: t.usuario?.id_usuario
        }
    }));
}

export async function salvarTransacao(transacao) {
    const resp = await fetch(urlApiTransacoes, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transacao)
    });

    if (!resp.ok) throw new Error("Erro ao salvar transação");
    return await resp.json();
}

export async function atualizarTransacao(transacao) {
    const resp = await fetch(urlApiTransacoes, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transacao)
    });

    if (!resp.ok) throw new Error("Erro ao atualizar transação");
    return await resp.json();
}

export async function excluirTransacao(id) {
    const resp = await fetch(`${urlApiTransacoes}/${id}`, {
        method: "DELETE"
    });

    if (!resp.ok) throw new Error("Erro ao excluir transação");
}

// NOVA FUNÇÃO: Buscar limites do backend
export async function buscarLimites() {
    try {
        const response = await fetch(urlApiLimites, { // Exemplo de endpoint GET para limites
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
            // Adicione Authorization Header se sua API exigir
            // 'Authorization': `Bearer ${localStorage.getItem('jwt')}` 
        });

        const data = await response.json();

        if (!response.ok) {
            // Se a resposta não for OK (ex: 404, 500), joga um erro com a mensagem da API
            throw new Error(data.mensagem || 'Erro ao buscar limites da API.');
        }

        // Supondo que a API retorna um objeto como: { "Alimentação": 500, "Transporte": 200 }
        // Ou um array de objetos que você precisaria converter para esse formato.
        // Se a sua API retorna um formato diferente, ajuste `data.limites` para o objeto correto.
        return { sucesso: true, dados: data.limites || data }; 
    } catch (error) {
        console.error("Erro em api.buscarLimites:", error);
        return { sucesso: false, mensagem: error.message || 'Erro desconhecido ao buscar limites.' };
    }
}

// NOVA FUNÇÃO: Salvar limites no backend
export async function salvarLimites(limites) {
    try {
        const response = await fetch(urlApiLimites, { // Exemplo de endpoint PUT para limites (substitui todos)
            method: 'PUT', // Ou 'POST' se você estiver enviando limites individuais ou adicionando
            headers: { 'Content-Type': 'application/json' },
            // Adicione Authorization Header se sua API exigir
            // 'Authorization': `Bearer ${localStorage.getItem('jwt')}` 
            body: JSON.stringify(limites) // Envia o objeto de limites diretamente
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensagem || 'Erro ao salvar limites na API.');
        }

        // A API pode retornar os limites recém-salvos ou uma mensagem de sucesso
        return { sucesso: true, mensagem: data.mensagem || 'Limites salvos com sucesso!', dados: data.limites || data };
    } catch (error) {
        console.error("Erro em api.salvarLimites:", error);
        return { sucesso: false, mensagem: error.message || 'Erro desconhecido ao salvar limites.' };
    }
}