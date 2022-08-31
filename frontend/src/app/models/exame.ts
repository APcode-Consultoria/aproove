import { Arquivo } from './arquivo';
import { Paciente } from './paciente';

export class Exame {

    id: number;
    paciente: Paciente;
    arquivo: Arquivo;
    dataUpload: Date;
    descricao: string;

}
