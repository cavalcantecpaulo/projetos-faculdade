/* ModeloFisicoProjetoBDD1: */

CREATE TABLE Medicamentos (
    medicamento_id INTEGER PRIMARY KEY,
    nome_generico VARCHAR(50),
    nome_comercial VARCHAR(50),
    unidade VARCHAR(10),
    localizacao VARCHAR(10),
    validade DATE,
    dosagem VARCHAR(10),
    quantidade INTEGER
);

CREATE TABLE ongs (
    cnpj VARCHAR(14) PRIMARY KEY,
    nome_ong VARCHAR(50),
    razao_social VARCHAR(100),
    telefone_ong VARCHAR(11),
    email_ong VARCHAR(100),
    endereco_ong VARCHAR(40)
);

CREATE TABLE Usuarios (
    usuario_prontuario VARCHAR(10) PRIMARY KEY,
    usuario_nome VARCHAR(50),
    tipo_usuario VARCHAR(15) CHECK (tipo_usuario IN ('administrador', 'assistente'))
);

CREATE TABLE Beneficiarios (
    beneficiario_cpf VARCHAR(11) PRIMARY KEY,
    beneficiario_nome VARCHAR(50),
    data_nascimento DATE,
    endereco VARCHAR(40),
    telefone VARCHAR(11),
    email VARCHAR(100)
);

CREATE TABLE Dependentes (
    dependente_cpf VARCHAR(11) PRIMARY KEY,
    dependente_nome VARCHAR(50),
    data_nascimento DATE,
    beneficiario_cpf VARCHAR(11),
    grau_parentesco VARCHAR(20),
    FOREIGN KEY (beneficiario_cpf) REFERENCES Beneficiarios (beneficiario_cpf)
);

CREATE TABLE Solicitacoes (
    solicitacao_id INTEGER PRIMARY KEY,
    medicamento_id INTEGER,
    cnpj VARCHAR(14),
    quantidade INTEGER,
    data_solicitacao DATE,
    status_solicitacao VARCHAR(10) CHECK(status_solicitacao IN ('Concluído', 'Pendente', 'Cancelado')),
    FOREIGN KEY (medicamento_id) REFERENCES Medicamentos(medicamento_id),
    FOREIGN KEY (cnpj) REFERENCES ongs(cnpj)
);

CREATE TABLE Recebimentos (
    recebimento_id INTEGER PRIMARY KEY,
    medicamento_id INTEGER,
    quantidade INTEGER,
    data_recebimento DATE,
    FOREIGN KEY (medicamento_id)REFERENCES Medicamentos(medicamento_id)
);

CREATE TABLE Perdimentos (
    perdimento_id INTEGER PRIMARY KEY,
    medicamento_id INTEGER,
    quantidade INTEGER,
    data_perdimento DATE,
    motivo VARCHAR(20) CHECK(motivo IN('vencido', 'sumido', 'danificado', 'registro incorreto')),
    FOREIGN KEY (medicamento_id)REFERENCES Medicamentos(medicamento_id)
);

CREATE TABLE Doacoes (
    beneficiario_cpf VARCHAR(11),
    medicamento_id INTEGER,
    quantidade INTEGER,
    data_doacao DATE,
    FOREIGN KEY (beneficiario_cpf) REFERENCES Beneficiarios (beneficiario_cpf)ON DELETE RESTRICT,
    FOREIGN KEY (medicamento_id) REFERENCES Medicamentos (medicamento_id)ON DELETE RESTRICT
);

CREATE TABLE ReceitasMedicas (
    receita_id INTEGER PRIMARY KEY,
    beneficiario_cpf VARCHAR(11),
    nome_medico VARCHAR(50),
    crm VARCHAR(20),
    data_receita DATE,
    validade DATE,
    FOREIGN KEY (beneficiario_cpf) REFERENCES Beneficiarios (beneficiario_cpf)
);

CREATE TABLE Logs (
    log_id INTEGER PRIMARY KEY,
    usuario_prontuario VARCHAR(10),
    data_log DATETIME,
    acao VARCHAR(25),
    FOREIGN KEY (usuario_prontuario) REFERENCES Usuarios(usuario_prontuario)
);
