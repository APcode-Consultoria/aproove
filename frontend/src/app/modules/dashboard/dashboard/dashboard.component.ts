import { Component, OnInit } from '@angular/core';
import { ExameService } from 'src/app/services/exame.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ProntuarioService } from 'src/app/services/prontuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
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