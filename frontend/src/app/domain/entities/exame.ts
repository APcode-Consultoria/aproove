import { Paciente } from './paciente';

export class Exame {

    id!: number;
    paciente!: Paciente;
    arquivo!: string;
    dataUpload!: Date;
    descricao!: string;

}
