import { Paciente } from "./paciente";

export class Prontuario {

    id!: number;
    dataRegistro!: Date;
    paciente!: Paciente;
    atendimento!: string;

}
