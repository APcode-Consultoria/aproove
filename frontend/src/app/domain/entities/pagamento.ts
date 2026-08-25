/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { Paciente } from "./paciente";
import { ServicoContratado } from "./servico-contratado";

export class Pagamento {

  id!: number;
  paciente!: Paciente;
  servicoContratado!: ServicoContratado;
  // Vencimento e valor vêm da contratação; a tela não os edita.
  dataVencimento!: Date;
  valor!: number;
  dataPagamento!: Date;
  valorPago!: number;
  dataCadastro!: Date;
  dataUltimaAtualizacao!: Date;
  usuarioCadastro!: string;
  usuarioUltimaAtualizacao!: string;

}
