/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PesquisarBaseComponent } from "@andre.penteado/ngx-apcore";
import { SERVICO_CAMPOS_PESQUISA, ServicoFiltro, ServicoService } from "../../../services/servico.service";
import { Servico } from "../../../domain/entities/servico";
import { Periodicidade, PERIODICIDADE_LABELS } from "../../../domain/enums/periodicidade";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'roove-servico-pesquisar',
  templateUrl: './pesquisar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class PesquisarComponent extends PesquisarBaseComponent<Servico> {

  filtro: ServicoFiltro = {};

  // O grid e o combo de filtro leem os labels daqui; nenhum texto de enum no template.
  protected readonly periodicidades = Object.values(Periodicidade);
  protected readonly periodicidadeLabels = PERIODICIDADE_LABELS;

  private servicoService = inject(ServicoService);

  protected readonly basePath = 'servico';
  protected readonly tableId = 'datatables-pesquisar-servicos';
  protected readonly rotuloPlural = 'serviços';

  /**
   * Origem da lista: o backend resolve o filtro em /pesquisar; a tela nunca filtra
   * `this.lista` em memória.
   */
  protected listar(): Observable<Servico[]> {
    return this.temFiltroPreenchido()
      ? this.servicoService.pesquisar(this.filtro)
      : this.servicoService.listar();
  }

  aplicarFiltro(): void {
    if (this.temFiltroPreenchido())
      console.info(`Pesquisar serviços com filtro ${JSON.stringify(this.filtro)}`);
    this.pesquisar();
  }

  limparFiltros(): void {
    this.filtro = {};
    this.pesquisar();
  }

  private temFiltroPreenchido(): boolean {
    return SERVICO_CAMPOS_PESQUISA.some(({ campo }) => !!this.filtro[campo]?.trim());
  }

  protected excluirRegistro(id: number): Observable<unknown> {
    return this.servicoService.excluir(id);
  }

  protected idDoRegistro(servico: Servico): number {
    return servico.id;
  }

  protected mensagemConfirmarExclusao(servico: Servico): string {
    return `Confirma a exclusão do serviço ${servico.nome}`;
  }

  /** Soma dos valores de inscrição da lista exibida, para o card de resumo. */
  get valorTotal(): number {
    return this.lista.reduce((total, servico) => total + (servico.valor ?? 0), 0);
  }

  /** Média dos valores de inscrição informados, ignorando serviços sem valor. */
  get valorMedio(): number {
    const comValor = this.lista.filter(servico => servico.valor != null);
    return comValor.length ? this.valorTotal / comValor.length : 0;
  }

}
