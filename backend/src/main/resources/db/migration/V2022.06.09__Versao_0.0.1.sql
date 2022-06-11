------------------------------------------------------------------------------

DROP TABLE IF EXISTS Arquivo CASCADE;
CREATE TABLE IF NOT EXISTS Arquivo (
    Id         BIGSERIAL NOT NULL,
    Nome       TEXT      NOT NULL,
    Tipo       TEXT      NOT NULL,
    Conteudo   BYTEA     NOT NULL,
    CONSTRAINT PK_Arquivo PRIMARY KEY (Id)
);

------------------------------------------------------------------------------

DROP TABLE IF EXISTS Paciente;
CREATE TABLE IF NOT EXISTS Paciente (
    Id         BIGSERIAL  NOT NULL,
    Cadastro   TIMESTAMP  NOT NULL,
    Nome       TEXT       NOT NULL,
    CPF        BIGINT     NULL,
    Nascimento DATE       NULL,
    Telefone   TEXT       NULL,
    Whatsapp   BOOLEAN    NULL,
    Email      TEXT       NULL,
    CEP        BIGINT     NULL,
    Logradouro TEXT       NULL,
    Numero     INTEGER    NULL,
    Bairro     TEXT       NULL,
    Cidade     TEXT       NULL,
    Estado     VARCHAR(2) NULL,
    Profissao  TEXT       NULL,
    Vencimento INTEGER    NULL,
    Frequencia INTEGER    NULL,
    Queixa     TEXT       NULL,
    Remedios   TEXT       NULL,
    Objetivos  TEXT       NULL,
    CONSTRAINT PK_Paciente PRIMARY KEY (Id),
    CONSTRAINT UN_Paciente_CPF UNIQUE (CPF)
);

------------------------------------------------------------------------------

DROP TABLE IF EXISTS Exame;
CREATE TABLE IF NOT EXISTS Exame (
    Id          BIGSERIAL NOT NULL,
    Id_Paciente BIGINT    NOT NULL,
    Id_Arquivo  BIGINT    NOT NULL,
    Descricao   TEXT      NOT NULL,
    CONSTRAINT PK_Exame_Paciente PRIMARY KEY (Id),
    CONSTRAINT FK_Exame_Paciente FOREIGN KEY (Id_Paciente) REFERENCES Paciente (Id),
    CONSTRAINT FK_Exame_Arquivo  FOREIGN KEY (Id_Arquivo)  REFERENCES Arquivo (Id),
    CONSTRAINT UN_Exame_PacienteArquivo UNIQUE (Id_Paciente, Id_Arquivo)
);

DROP TABLE IF EXISTS Prontuario;
CREATE TABLE IF NOT EXISTS Prontuario (
    Id          BIGSERIAL NOT NULL,
    Id_Paciente BIGINT    NOT NULL,
    Registro    TIMESTAMP NOT NULL,
    Atendimento TEXT      NOT NULL,
    CONSTRAINT PK_Prontuario PRIMARY KEY (Id),
    CONSTRAINT FK_Prontuario_Paciente FOREIGN KEY (Id_Paciente) REFERENCES Paciente (Id)
);
