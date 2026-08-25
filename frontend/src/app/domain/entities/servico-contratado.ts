/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { Paciente } from "./paciente";
import { Servico } from "./servico";

export class ServicoContratado {

  id!: number;
  // `persistencia: independente`: o filho trafega sozinho e a tela preenche a volta ao
  // pai antes de gravar.
  paciente!: Paciente;
  servico!: Servico;
  inicioContratacao!: Date;
  fimContratacao!: Date;
  valorContratado!: number;
  // Os N valores da frequência numa string só, separados por ponto e vírgula.
  frequencia!: string;
  // Um horário por ocorrência da frequência, na mesma ordem.
  horarios!: string;
  dataCadastro!: Date;
  dataUltimaAtualizacao!: Date;
  usuarioCadastro!: string;
  usuarioUltimaAtualizacao!: string;

}
