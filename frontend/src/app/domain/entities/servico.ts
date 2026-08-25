/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { Periodicidade } from "../enums/periodicidade";

export class Servico {

  id!: number;
  dataCadastro!: Date;
  dataUltimaAtualizacao!: Date;
  usuarioCadastro!: string;
  usuarioUltimaAtualizacao!: string;
  nome!: string;
  // `moeda` trafega como number no JSON; a formatacao com R$ e da tela.
  valor!: number;
  // Duracao do atendimento em minutos, usada pela agenda para derivar o horario final.
  duracao!: number;
  // Quantas ocorrencias o servico tem dentro da periodicidade: e o numero de controles
  // que a aba de contratacao abre.
  frequencia!: number;
  periodicidade!: Periodicidade;

}
