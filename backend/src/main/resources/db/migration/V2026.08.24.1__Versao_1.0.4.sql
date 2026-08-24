-- Cadastro de servicos oferecidos pela clinica (valor da inscricao e frequencia) e os
-- servicos contratados por paciente, N:M entre Paciente e Servico.
-- Gerado a partir de .cruds/servico.yaml e .cruds/paciente.yaml com ajuda da IA
-- (Andre Penteado, 24/08/2026). Servico_Contratado vem depois de Servico no mesmo
-- arquivo porque a FK depende dela.
--
-- A versao Flyway leva o sufixo ".1" porque V2026.08.24 ja foi usada pela versao 1.0.3:
-- o prefixo do arquivo e a chave de versao e nao pode repetir, mesmo com descricao
-- diferente. 2026.08.24.1 ordena depois de 2026.08.24, entao a sequencia se mantem.

CREATE TABLE IF NOT EXISTS Servico (
    Id                         BIGSERIAL     NOT NULL,
    Data_Cadastro              TIMESTAMP     NOT NULL,
    Usuario_Cadastro           TEXT          NOT NULL,
    Data_Ultima_Atualizacao    TIMESTAMP     NULL,
    Usuario_Ultima_Atualizacao TEXT          NULL,
    Nome                       TEXT          NOT NULL,
    -- NUMERIC com escala 2 fixa: dinheiro nunca em FLOAT/DOUBLE, que erra centavos
    -- em soma e comparacao.
    Valor                      NUMERIC(15,2) NULL,
    Frequencia_Periodicidade   INTEGER       NULL,
    -- Enum gravado como texto (@Enumerated(EnumType.STRING)), nunca ordinal: a posicao
    -- da constante mudaria o significado dos registros ja gravados.
    Periodicidade              TEXT          NULL,
    CONSTRAINT PK_Servico PRIMARY KEY (Id),
    CONSTRAINT CK_Servico_Periodicidade CHECK (Periodicidade IS NULL OR Periodicidade IN ('SEMANAL', 'QUINZENAL', 'MENSAL'))
);

CREATE INDEX IF NOT EXISTS IDX_Servico_Nome ON Servico (Nome);

------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Servico_Contratado (
    Id                         BIGSERIAL     NOT NULL,
    Id_Paciente                BIGINT        NOT NULL,
    FK_Servico                 BIGINT        NOT NULL,
    Inicio_Contratacao         DATE          NOT NULL,
    Fim_Contratacao            DATE          NULL,
    Valor_Contratado           NUMERIC(15,2) NULL,
    -- Coluna unica com os N valores da frequencia, separados por ponto e virgula
    -- (ex.: '5;12;20' para mensal, '1;3' para semanal, onde 0=domingo). Decisao
    -- deliberada de desnormalizacao: nao da para indexar nem agregar por dia no SQL.
    Frequencia                 TEXT          NULL,
    Data_Cadastro              TIMESTAMP     NOT NULL,
    Usuario_Cadastro           TEXT          NOT NULL,
    Data_Ultima_Atualizacao    TIMESTAMP     NULL,
    Usuario_Ultima_Atualizacao TEXT          NULL,
    CONSTRAINT PK_Servico_Contratado PRIMARY KEY (Id),
    -- CASCADE no paciente: sem orphanRemoval em `persistencia: independente`, o pai
    -- nao poderia ser excluido enquanto houvesse contratacao.
    CONSTRAINT FK_Servico_Contratado_Paciente FOREIGN KEY (Id_Paciente) REFERENCES Paciente (Id) ON DELETE CASCADE,
    -- RESTRICT no servico: excluir um servico que alguem contratou apagaria historico.
    CONSTRAINT FK_Servico_Contratado_Servico  FOREIGN KEY (FK_Servico)  REFERENCES Servico (Id)
);

-- A leitura da colecao sempre filtra pela FK do pai.
CREATE INDEX IF NOT EXISTS IDX_ServicoContratado_IdPaciente ON Servico_Contratado (Id_Paciente);
