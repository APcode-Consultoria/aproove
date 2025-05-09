import { Component, OnInit } from '@angular/core';
import { ExameService } from "../../../services/exame.service";
import { ProntuarioService } from "../../../services/prontuario.service";
import { PacienteService } from "../../../services/paciente.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: [],
    standalone: false
})
export class DashboardComponent implements OnInit {

  totalExames: number = 0;
  totalAtendimentos: number = 0;
  totalPacientes: number = 0;

  constructor(
    private exameService: ExameService,
    private prontuarioService: ProntuarioService,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.exibeTotais();
  }

  exibeTotais(): void {
    this.exameService.total().subscribe({next: totalExames => this.totalExames = totalExames});
    this.prontuarioService.total().subscribe({next: totalAtendimentos => this.totalAtendimentos = totalAtendimentos});
    this.pacienteService.total().subscribe({next: totalPacientes => this.totalPacientes = totalPacientes});
  }

}
