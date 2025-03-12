import { Parentesco } from "../enums/parentesco";

export class Paciente {

  id!: number;
  dataCadastro!: Date;
  dataUltimaAtualizacao!: Date;
  usuarioCadastro!: string;
  usuarioUltimaAtualizacao!: string;
  nome!: string;
  cpf!: number;
  dataNascimento!: Date;
  telefone!: number;
  whatsapp!: boolean;
  email!: string;
  contatoEmergencia!: string;
  parentescoContatoEmergencia!: Parentesco;
  cep!: number;
  logradouro!: string;
  complemento!: string;
  numeroLogradouro!: number;
  bairro!: string;
  cidade!: string;
  estado!: string;
  profissao!: string;
  diaVencimento!: number;
  frequenciaSemanal!: number;
  historiaMolestiaPregressa!: string;
  queixaPrincipal!: string;
  remedios!: string;
  objetivos!: string;

}
