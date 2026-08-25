/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PesquisarBaseComponent } from "@andre.penteado/ngx-apcore";
import { PagamentoFiltro, PagamentoService } from "../../../services/pagamento.service";
import { Pagamento } from "../../../domain/entities/pagamento";
import { EMPTY, Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'roove-pagamento-pesquisar',
  templateUrl: './pesquisar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class PesquisarComponent extends PesquisarBaseComponent<Pagamento> {

  filtro: PagamentoFiltro = {};

  private pagamentoService = inject(PagamentoService);

  protected readonly basePath = 'pagamento';
  protected readonly tableId = 'datatables-pesquisar-pagamentos';
  protected readonly rotuloPlural = 'pagamentos';

  protected listar(): Observable<Pagamento[]> {
    return this.temFiltroPreenchido()
      ? this.pagamentoService.pesquisar(this.filtro)
      : this.pagamentoService.listar();
  }

  aplicarFiltro(): void {
    if (this.temFiltroPreenchido())
      console.info(`Pesquisar pagamentos com filtro ${JSON.stringify(this.filtro)}`);
    this.pesquisar();
  }

  limparFiltros(): void {
    this.filtro = {};
    this.pesquisar();
  }

  private temFiltroPreenchido(): boolean {
    return !!(this.filtro.pagos || this.filtro.vencidos || this.filtro.aVencer
      || this.filtro.inicio?.trim() || this.filtro.fim?.trim());
  }

  // Tela somente leitura: não há botão de excluir nem de incluir, então estes dois
  // membros do contrato da base nunca são acionados. Ficam declarados porque a base os
  // exige, e `EMPTY` deixa explícito que a exclusão não existe aqui.
  protected excluirRegistro(): Observable<unknown> {
    return EMPTY;
  }

  protected mensagemConfirmarExclusao(): string {
    return '';
  }

  protected idDoRegistro(pagamento: Pagamento): number {
    return pagamento.id;
  }

  /** Data de hoje em ISO, para comparar com o vencimento sem esbarrar em fuso. */
  private get hojeIso(): string {
    return new Date().toISOString().substring(0, 10);
  }

  /**
   * Situação da linha, com a mesma regra do PagamentoFilter do backend: vencimento de
   * hoje conta como "a vencer", não como vencido.
   */
  situacao(pagamento: Pagamento): 'PAGO' | 'VENCIDO' | 'A_VENCER' {
    if (pagamento.dataPagamento) {
      return 'PAGO';
    }

    return String(pagamento.dataVencimento).substring(0, 10) < this.hojeIso ? 'VENCIDO' : 'A_VENCER';
  }

  get totalRecebido(): number {
    return this.lista.filter(p => p.dataPagamento).reduce((total, p) => total + (p.valorPago ?? 0), 0);
  }

  get totalEmAberto(): number {
    return this.lista.filter(p => !p.dataPagamento).reduce((total, p) => total + (p.valor ?? 0), 0);
  }

  get quantidadeVencidos(): number {
    return this.lista.filter(p => this.situacao(p) === 'VENCIDO').length;
  }

}
