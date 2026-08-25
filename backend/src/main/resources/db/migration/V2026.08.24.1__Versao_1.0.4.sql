-- Cadastro de servicos oferecidos pela clinica (valor da inscricao e frequencia), os
-- servicos contratados por paciente (N:M entre Paciente e Servico) e os pagamentos
-- dessas contratacoes.
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
    -- Duracao do atendimento em minutos. E o que a agenda soma ao horario inicial da
    -- contratacao para derivar o horario final.
    Duracao                    INTEGER       NULL,
    -- Quantas ocorrencias o servico tem dentro da periodicidade, e portanto quantos
    -- controles a aba de contratacao abre.
    Frequencia                 INTEGER       NULL,
    -- Enum gravado como texto (@Enumerated(EnumType.STRING)), nunca ordinal: a posicao
    -- da constante mudaria o significado dos registros ja gravados.
    Periodicidade              TEXT          NULL,
    CONSTRAINT PK_Servico PRIMARY KEY (Id),
    CONSTRAINT CK_Servico_Periodicidade CHECK (Periodicidade IS NULL OR Periodicidade IN ('AVULSO', 'SEMANAL', 'MENSAL'))
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
    -- Coluna unica com os N valores da frequencia, separados por ponto e virgula. O
    -- significado vem da periodicidade do servico: AVULSO grava datas ISO
    -- ('2026-09-15;2026-09-22'), SEMANAL grava nomes de dia da semana
    -- ('SEGUNDA;QUINTA') e MENSAL grava dias do mes ('5;12;20'). Decisao deliberada de
    -- desnormalizacao: nao da para indexar nem agregar por dia no SQL.
    Frequencia                 TEXT          NULL,
    -- Um horario inicial por ocorrencia da frequencia, na mesma ordem e tambem separado
    -- por ponto e virgula (ex.: frequencia 'TERCA;QUINTA' com horarios '08:00;14:00' =
    -- terca as 8h e quinta as 14h). E o horario que torna a agenda possivel; o horario
    -- final nao e gravado, sai da soma com Servico.Duracao.
    Horarios                   TEXT          NULL,
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

------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Pagamento (
    Id                         BIGSERIAL     NOT NULL,
    -- Volta ao pai da lista. Redundante com Servico_Contratado.Id_Paciente de
    -- proposito: e o que deixa a leitura da aba um filtro direto por paciente. O
    -- service preenche a partir da contratacao, nunca do payload, para nao divergir.
    Id_Paciente                BIGINT        NOT NULL,
    FK_Servico_Contratado      BIGINT        NOT NULL,
    Data_Vencimento            DATE          NOT NULL,
    Valor                      NUMERIC(15,2) NULL,
    Data_Pagamento             DATE          NULL,
    Valor_Pago                 NUMERIC(15,2) NULL,
    Data_Cadastro              TIMESTAMP     NOT NULL,
    Usuario_Cadastro           TEXT          NOT NULL,
    Data_Ultima_Atualizacao    TIMESTAMP     NULL,
    Usuario_Ultima_Atualizacao TEXT          NULL,
    CONSTRAINT PK_Pagamento PRIMARY KEY (Id),
    CONSTRAINT FK_Pagamento_Paciente FOREIGN KEY (Id_Paciente) REFERENCES Paciente (Id) ON DELETE CASCADE,
    CONSTRAINT FK_Pagamento_ServicoContratado FOREIGN KEY (FK_Servico_Contratado) REFERENCES Servico_Contratado (Id) ON DELETE CASCADE
);

-- A leitura da colecao sempre filtra pela FK do pai.
CREATE INDEX IF NOT EXISTS IDX_Pagamento_IdPaciente ON Pagamento (Id_Paciente);

------------------------------------------------------------------------------

-- A frequencia semanal do paciente foi substituida pela frequencia da contratacao:
-- quem define quantos atendimentos ele tem, e em que dias, e o servico contratado, nao
-- um inteiro solto no cadastro. Manter os dois deixaria a agenda com duas fontes que
-- podem divergir.
--
-- O DROP vem nesta migration, e nao numa nova, porque a versao 1.0.4 ainda nao foi
-- para producao e e ela que introduz a contratacao que substitui a coluna.
ALTER TABLE Paciente DROP COLUMN IF EXISTS Frequencia_Semanal;
