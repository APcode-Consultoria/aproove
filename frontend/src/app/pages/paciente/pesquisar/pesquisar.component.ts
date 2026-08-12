import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService, PesquisarBaseComponent } from "@andre.penteado/ngx-apcore";
import { PacienteService } from "../../../services/paciente.service";
import { ExameService } from "../../../services/exame.service";
import { ProntuarioService } from "../../../services/prontuario.service";
import { Paciente } from "../../../domain/entities/paciente";
import { PREFIXO_PERFIL_SISTEMA } from "../../../config/layout";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    RouterLink
  ]
})
export class PesquisarComponent extends PesquisarBaseComponent<Paciente> {

  protected readonly PREFIXO_PERFIL_SISTEMA = PREFIXO_PERFIL_SISTEMA;

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
    this.exibeTotais();
  }

  protected listar(): Observable<Paciente[]> {
    return this.pacienteService.listar();
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
