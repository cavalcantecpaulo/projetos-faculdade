-- *********************************************************************
-- Consultas simples de Visualização do Banco de Dados Pharmalog
-- *********************************************************************

-- 1. Selecionando Doações de Medicamentos e juntando com nome dos Beneficiarios
SELECT 
    B.beneficiario_nome, 
    M.nome_comercial, 
    D.quantidade, 
    D.data_doacao  
FROM Doacoes D 
JOIN Medicamentos M ON D.medicamento_id = M.medicamento_id 
JOIN Beneficiarios B ON D.beneficiario_cpf = B.beneficiario_cpf;

-- 2. Mostrando Logs do Sistema
SELECT 
    U.usuario_nome, 
    L.acao, 
    L.data_log 
FROM Logs L 
JOIN Usuarios U ON L.usuario_prontuario = U.usuario_prontuario;

-- 3. Mostrando Medicamentos Recebidos
SELECT 
    m.nome_comercial AS "Medicamentos Recebidos", 
    r.quantidade,
    r.data_recebimento 
FROM Recebimentos r 
JOIN Medicamentos m ON m.medicamento_id = r.medicamento_id;

-- 4. Mostrar apenas Medicamentos que não estão vencidos
SELECT  
    * 
FROM medicamentos 
WHERE validade >= '2025-02-13';

-- 5. Mostrar Ongs
SELECT * FROM ongs;

-- 6. Ordenar usuários pela ordem alfabética
SELECT * FROM Usuarios 
ORDER BY usuario_nome ASC;

-- *********************************************************************
-- Fim do Script de Visualização
-- *********************************************************************
