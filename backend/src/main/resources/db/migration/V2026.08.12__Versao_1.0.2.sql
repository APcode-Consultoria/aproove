-- Auditoria das listas independentes do paciente: usuário que criou o registro.
-- Nulo nos registros existentes, gravados antes da auditoria.
ALTER TABLE Prontuario ADD COLUMN Usuario_Registro TEXT;

ALTER TABLE Exame ADD COLUMN Usuario_Upload TEXT;


