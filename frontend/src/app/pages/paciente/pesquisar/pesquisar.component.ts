import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService, PesquisarBaseComponent } from "@andre.penteado/ngx-apcore";
import { PACIENTE_CAMPOS_PESQUISA, PacienteFiltro, PacienteService } from "../../../services/paciente.service";
import { ExameService } from "../../../services/exame.service";
import { ProntuarioService } from "../../../services/prontuario.service";
import { Paciente } from "../../../domain/entities/paciente";
import { PREFIXO_PERFIL_SISTEMA } from "../../../config/layout";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { MASCARA_CPF, MASCARA_TELEFONE } from "../cadastro/cadastro.component";

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    RouterLink
  ]
})
export class PesquisarComponent extends PesquisarBaseComponent<Paciente> {

  protected readonly PREFIXO_PERFIL_SISTEMA = PREFIXO_PERFIL_SISTEMA;

  // As mesmas máscaras do cadastro: os dois campos são gravados só com dígitos, e o
  // ngx-mask entrega ao filtro o valor sem máscara. `validation` fica desligado porque
  // filtro aceita valor parcial — pesquisar por parte do telefone é caso de uso.
  protected readonly mascaraCpf = MASCARA_CPF;
  protected readonly mascaraTelefone = MASCARA_TELEFONE;

  filtro: PacienteFiltro = {};

  totalExames: number = 0;
  totalAtendimentos: number = 0;

  private pacienteService = inject(PacienteService);
  private exameService = inject(ExameService);
  private prontuarioService = inject(ProntuarioService);
  protected loginService = inject(LoginService);

  protected readonly basePath = 'paciente';
  protected readonly tableId = 'datatables-pesquisar-pacientes';
  protected readonly rotuloPlural = 'pacientes';

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.isDiretor)
      this.exibeTotais();
  }

  get isDiretor(): boolean {
    return this.loginService.hasRole(`${PREFIXO_PERFIL_SISTEMA}DIRETOR`);
  }

  protected listar(): Observable<Paciente[]> {
    return this.temFiltroPreenchido()
      ? this.pacienteService.pesquisar(this.filtro)
      : this.pacienteService.listar();
  }

  aplicarFiltro(): void {
    if (this.temFiltroPreenchido())
      console.info(`Pesquisar pacientes com filtro ${JSON.stringify(this.filtro)}`);
    this.pesquisar();
  }

  limparFiltros(): void {
    this.filtro = {};
    this.pesquisar();
  }

  private temFiltroPreenchido(): boolean {
    return PACIENTE_CAMPOS_PESQUISA.some(({ campo }) => !!this.filtro[campo]?.trim());
  }

  protected excluirRegistro(id: number): Observable<unknown> {
    return this.pacienteService.excluir(id);
  }

  protected idDoRegistro(paciente: Paciente): number {
    return paciente.id;
  }

  protected mensagemConfirmarExclusao(paciente: Paciente): string {
    return `Confirma a exclusão do paciente ${paciente.nome}`;
  }

  exibeTotais(): void {
    this.exameService.total().subscribe({ next: totalExames => this.totalExames = totalExames });
    this.prontuarioService.total().subscribe({ next: totalAtendimentos => this.totalAtendimentos = totalAtendimentos });
  }

}
