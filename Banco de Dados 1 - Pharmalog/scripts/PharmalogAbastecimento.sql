-- *********************************************************************
-- Script para abastecer o banco de dados'PharmaLog'
-- *********************************************************************

-- 1. Inserindo Medicamentos
INSERT INTO Medicamentos (medicamento_id, nome_generico, nome_comercial, unidade, localizacao, validade, dosagem, quantidade)
VALUES
(1, 'Dipirona', 'Dipirona', 'FRASCO', 'E1-A', '2021-10-10', '500 mg/mL', 1),
(2, 'Dorflex', 'Dorflex', 'CARTELA', 'E2-B', '2023-01-12', '300 mg', 2),
(3, 'Paracetamol', 'Tylenol', 'CARTELA', 'E1-B', '2020-03-01', '500 mg', 5),
(4, 'Omeprazol', 'Omeprazol', 'CARTELA', 'E2-C', '2025-11-15', '20 mg', 1),
(5, 'Ibuprofeno', 'Ibuprofeno', 'CARTELA', 'E1-A', '2021-06-16', '400 mg', 0),
(6, 'Buscopan Composto', 'Buscopan Composto', 'FRASCO', 'E2-D', '2022-04-17', '10 mg', 4),
(7, 'Dimenidrinato', 'Dramin', 'CARTELA', 'E1-C', '2021-12-10', '50 mg', 3),
(8, 'Metoclopramida', 'Plasil', 'CARTELA', 'E2-E', '2021-10-19', '10 mg', 1),
(9, 'Cimegripe', 'Cimegripe', 'CARTELA', 'E1-C', '2023-03-12', '500 mg', 2),
(10, 'Amoxicilina', 'Amoxilina', 'CARTELA', 'E2-C', '2020-08-21', '500 mg', 5),
(11, 'Amoxicilina', 'Amoxan', 'CARTELA', 'E1-D', '2025-11-19', '500 mg', 4),
(12, 'Diazepam', 'Diazepan', 'CARTELA', 'E2-D', '2021-09-16', '5 mg', 2),
(13, 'Dipirona Sódica', 'Dipirona Sódica', 'FRASCO', 'E1-A', '2022-07-17', '500 mg/mL', 5);

-- 2. Inserindo Usuários
INSERT INTO Usuarios (usuario_prontuario, usuario_nome, tipo_usuario)
VALUES
('CJ146456', 'Domingos Lucas Latorre de Oliveira', 'administrador'),
('CP220383', 'Leandro Pinto Santana', 'administrador'),
('RC134168', 'Rodrigo Ribeiro de Oliveira', 'administrador'),
('SP030028', 'Andre Luiz da Silva', 'administrador'),
('SP030041', 'Claudia Miyuki Werhmuller', 'administrador'),
('SP03020X', 'Claudete de Oliveira Alves', 'administrador'),
('SP030247', 'Francisco Veríssimo Luciano', 'administrador'),
('SP060380', 'Luk Cho Man', 'administrador'),
('SP060835', 'Ivan Francolin Martinez', 'administrador'),
('SP060914', 'Joao Vianei Tamanini', 'administrador'),
('SP070038', 'Jose Oscar Machado Alexandre', 'administrador'),
('SP070385', 'Jose Braz de Araujo', 'administrador'),
('SP070816', 'Paulo Roberto de Abreu', 'administrador'),
('SP07102X', 'Eurides Balbino da Silva', 'administrador'),
('SP090888', 'Domingos Bernardo Gomes Santos', 'administrador'),
('SP100092', 'Andre Evandro Lourenco', 'administrador'),
('SP102763', 'Miguel Angelo Tancredi Molina', 'administrador'),
('SP112197', 'Antonio Airton Palladino', 'administrador'),
('SP145385', 'Luís Fernando Aires Branco Meneguefi', 'administrador'),
('SP200827', 'Antonio Ferreira Viana', 'administrador'),
('SP204973', 'Leonardo Bertholdo', 'administrador'),
('SP20500X', 'Marcelo Tavares de Santana', 'administrador'),
('SP215016', 'Wagner de Paula Gomes', 'administrador'),
('SP220097', 'Daniel Marques Gomes de Morais', 'administrador'),
('SP226117', 'Alexandre Beletti Ferreira', 'administrador'),
('SP240291', 'Vladimir Camelo Pinto', 'administrador'),
('SP24031X', 'Leonardo Andrade Motta de Lima', 'administrador'),
('SP240497', 'Aldo Marcelo Paim', 'administrador'),
('SP890534', 'Cesar Lopes Fernandes', 'administrador'),
('SZ124382', 'Josceli Maria Tenorio', 'administrador');

-- 3. Inserindo Beneficiários
INSERT INTO Beneficiarios (beneficiario_cpf, beneficiario_nome, data_nascimento, endereco, telefone, email)
VALUES
('11122233344', 'Joao Basso', '1985-05-12', 'Rua dos Bagres, 123', '11988887777', 'bagre1@gmail.com'),
('55566677788', 'Leo Godoy', '1990-09-22', 'Avenida Ruim, 456', '11999996666', 'bagre2@yahoo.com');

-- 4. Inserindo Dependentes
INSERT INTO Dependentes (dependente_cpf, dependente_nome, data_nascimento, beneficiario_cpf, grau_parentesco)
VALUES
('22233344455', 'Lucas Braço', '2012-08-15', '11122233344', 'Filho'),
('33344455566', 'Mariana Perna', '2015-11-20', '11122233344', 'Filha'),
('66677788899', 'Juan Godoy', '2018-03-10', '55566677788', 'Filho'),
('77788899900', 'Martina Godoy', '2016-07-25', '55566677788', 'Filha');

-- 5. Inserindo ONGs
INSERT INTO ongs (cnpj, nome_ong, razao_social, telefone_ong, email_ong, endereco_ong)
VALUES
('12345678000199', 'ONG Saúde para Todos', 'ONG Saúde LTDA', '11987654321', 'contato@saudetodos.org', 'Rua das Flores, 123'),
('98765432000188', 'Medicamentos Solidários', 'Solidários ONG', '11912345678', 'ajuda@solidarios.org', 'Av. Central, 456');

-- 6. Inserindo Solicitações
INSERT INTO Solicitacoes (solicitacao_id, medicamento_id, cnpj, quantidade, data_solicitacao, status_solicitacao)
VALUES
(1, 1, '12345678000199', 50, '2025-01-01', 'Pendente'),
(2, 2, '98765432000188', 100, '2025-01-02', 'Concluído'),
(3, 2, '12345678000199', 10, '2025-02-13', 'Pendente');

-- 7. Inserindo Recebimentos
INSERT INTO Recebimentos (recebimento_id, medicamento_id, quantidade, data_recebimento)
VALUES
(1, 1, 50, '2025-01-10'),
(2, 2, 100, '2025-01-12');

-- 8. Inserindo Perdimentos
INSERT INTO Perdimentos (perdimento_id, medicamento_id, quantidade, data_perdimento, motivo)
VALUES
(1, 1, 5, '2025-06-01', 'vencido'),
(2, 2, 2, '2025-06-05', 'danificado');

-- 9. Inserindo Doações
INSERT INTO Doacoes (beneficiario_cpf, medicamento_id, quantidade, data_doacao)
VALUES
('11122233344', 1, 10, '2025-02-01'),
('55566677788', 2, 5, '2025-02-02');

-- 10. Inserindo Receitas Médicas
INSERT INTO ReceitasMedicas (receita_id, beneficiario_cpf, nome_medico, crm, data_receita, validade)
VALUES
(1, '11122233344', 'Dr. Ricardo', 'CRM-12345', '2025-02-01', '2025-08-01'),
(2, '55566677788', 'Dra. Fernanda', 'CRM-54321', '2025-03-01', '2025-09-01');

-- 11. Inserindo Logs
INSERT INTO Logs (log_id, usuario_prontuario, data_log, acao)
VALUES
(1, 'CJ146456', '2025-01-10 10:30:00', 'Adicionou medicamentos ao sistema'),
(2, 'CP220383', '2025-02-10 11:00:00', 'Alterou o estoque de medicamentos');

---
