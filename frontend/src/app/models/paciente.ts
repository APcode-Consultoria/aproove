import { Parentesco } from "./enums/parentesco";

export class Paciente {

    id: number;
    dataCadastro: Date;
    nome: string;
    cpf: number;
    dataNascimento: string;
    telefone: string;
    whatsapp: boolean;
    email: string;
    contatoEmergencial: string;
    parentescoContatoEmergencial: Parentesco;
    cep: number;
    logradouro: string;
    numeroLogradouro: number;
    bairro: string;
    cidade: string;
    estado: string;
    profissao: string;
    diaVencimento: number;
    frequenciaSemanal: number;
    historiaMolestiaPregressa: string;
    queixaPrincipal: string;
    remedios: string;
    objetivos: string;

}
