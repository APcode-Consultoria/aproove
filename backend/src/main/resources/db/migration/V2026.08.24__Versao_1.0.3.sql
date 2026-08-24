-- CPF, CEP e Telefone sao sequencias de digitos, nao numeros: gravados em BIGINT o
-- zero a esquerda se perdia (012.345.678-90 virava 1234567890). Alem de exibir o dado
-- errado na tela, o valor truncado nao fechava a mascara do formulario e travava o
-- Gravar do paciente sem apontar o campo culpado.
--
-- O LPAD restaura os zeros perdidos: CPF tem sempre 11 digitos e CEP sempre 8, entao o
-- que estiver mais curto perdeu zeros a esquerda. O CASE protege valores ja com o
-- tamanho esperado (ou maiores), que o LPAD truncaria. Telefone fica sem preenchimento:
-- 10 digitos (fixo) e 11 (celular) sao ambos validos e nao da para distinguir um fixo de
-- um celular que perdeu digito.

ALTER TABLE Paciente
    ALTER COLUMN CPF TYPE TEXT
    USING CASE WHEN LENGTH(CPF::TEXT) < 11 THEN LPAD(CPF::TEXT, 11, '0') ELSE CPF::TEXT END;

ALTER TABLE Paciente
    ALTER COLUMN CEP TYPE TEXT
    USING CASE WHEN LENGTH(CEP::TEXT) < 8 THEN LPAD(CEP::TEXT, 8, '0') ELSE CEP::TEXT END;

ALTER TABLE Paciente
    ALTER COLUMN Telefone TYPE TEXT
    USING Telefone::TEXT;
