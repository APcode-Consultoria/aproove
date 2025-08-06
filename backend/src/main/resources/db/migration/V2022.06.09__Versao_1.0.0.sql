------------------------------------------------------------------------------

DROP TABLE IF EXISTS Upload CASCADE;
CREATE TABLE IF NOT EXISTS Upload (
    UUID       UUID         NOT NULL,
    Nome       TEXT         NOT NULL,
    Descricao  TEXT         NULL,
    Tipo_Mime  TEXT         NOT NULL,
    Tamanho    BIGINT       NOT NULL,
    Base64     TEXT         NOT NULL,
    CONSTRAINT PK_Upload    PRIMARY KEY (UUID)
);

------------------------------------------------------------------------------
-- Popular com dados de testes:
-- insert into paciente(data_cadastro,nome,cpf,telefone,email,queixa_principal,historia_molestia_pregressa) select now(), md5(random()::text),floor(random()*(99999999999-10000000000)),floor(random()*(99999999999-10000000000)),md5(random()::text),md5(random()::text),md5(random()::text) from generate_series(1,100) id;
DROP TABLE IF EXISTS Paciente;
CREATE TABLE IF NOT EXISTS Paciente (
    Id                            BIGSERIAL  NOT NULL,
    Data_Cadastro                 TIMESTAMP  NOT NULL,
    Usuario_Cadastro              TEXT       NOT NULL,
    Data_Ultima_Atualizacao       TIMESTAMP  NULL,
    Usuario_Ultima_Atualizacao    TEXT       NULL,
    Nome                          TEXT       NOT NULL,
    CPF                           BIGINT     NOT NULL,
    Data_Nascimento               DATE       NULL,
    Telefone                      BIGINT     NULL,
    Whatsapp                      BOOLEAN    NULL,
    Email                         TEXT       NULL,
    Contato_Emergencia            TEXT       NULL,
    Parentesco_Contato_Emergencia TEXT       NULL,
    CEP                           BIGINT     NULL,
    Logradouro                    TEXT       NULL,
    Numero_Logradouro             INTEGER    NULL,
    Bairro                        TEXT       NULL,
    Cidade                        TEXT       NULL,
    Estado                        TEXT       NULL,
    Complemento                   TEXT       NULL,
    Profissao                     TEXT       NULL,
    Dia_Vencimento                INTEGER    NULL,
    Frequencia_Semanal            INTEGER    NULL,
    Queixa_Principal              TEXT       NOT NULL,
    Historia_Molestia_Pregressa   TEXT       NOT NULL,
    Remedios                      TEXT       NULL,
    Objetivos                     TEXT       NULL,
    Responsavel                   TEXT       NULL,
    CONSTRAINT PK_Paciente PRIMARY KEY (Id),
    CONSTRAINT UN_Paciente_CPF UNIQUE (CPF)
);

------------------------------------------------------------------------------

DROP TABLE IF EXISTS Exame;
CREATE TABLE IF NOT EXISTS Exame (
    Id          BIGSERIAL NOT NULL,
    Id_Paciente BIGINT    NOT NULL,
    FK_Upload   UUID      NOT NULL,
    Descricao   TEXT      NOT NULL,
    Data_Upload TIMESTAMP NOT NULL,
    CONSTRAINT PK_Exame_Paciente PRIMARY KEY (Id),
    CONSTRAINT FK_Exame_Paciente FOREIGN KEY (Id_Paciente) REFERENCES Paciente (Id),
    CONSTRAINT FK_Exame_Arquivo  FOREIGN KEY (FK_Upload)  REFERENCES Upload (UUID),
    CONSTRAINT UN_Exame_PacienteArquivo UNIQUE (Id_Paciente, FK_Upload)
);

DROP TABLE IF EXISTS Prontuario;
CREATE TABLE IF NOT EXISTS Prontuario (
    Id            BIGSERIAL NOT NULL,
    Id_Paciente   BIGINT    NOT NULL,
    Data_Registro TIMESTAMP NOT NULL,
    Atendimento   TEXT      NOT NULL,
    CONSTRAINT PK_Prontuario PRIMARY KEY (Id),
    CONSTRAINT FK_Prontuario_Paciente FOREIGN KEY (Id_Paciente) REFERENCES Paciente (Id)
);
