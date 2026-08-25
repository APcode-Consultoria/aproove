import { Parentesco } from "../enums/parentesco";

export class Paciente {

  id!: number;
  dataCadastro!: Date;
  dataUltimaAtualizacao!: Date;
  usuarioCadastro!: string;
  usuarioUltimaAtualizacao!: string;
  nome!: string;
  cpf!: string;
  dataNascimento!: Date;
  telefone!: string;
  whatsapp!: boolean;
  email!: string;
  contatoEmergencia!: string;
  parentescoContatoEmergencia!: Parentesco;
  cep!: string;
  logradouro!: string;
  complemento!: string;
  numeroLogradouro!: number;
  bairro!: string;
  cidade!: string;
  estado!: string;
  profissao!: string;
  diaVencimento!: number;
  historiaMolestiaPregressa!: string;
  queixaPrincipal!: string;
  remedios!: string;
  objetivos!: string;
  responsavel!: string;
  observacao!: string;

}
