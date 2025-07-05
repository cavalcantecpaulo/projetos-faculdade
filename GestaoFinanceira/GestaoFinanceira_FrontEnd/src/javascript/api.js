const urlApiTransacoes = "http://localhost:8080/api/v1/transacoes";

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
