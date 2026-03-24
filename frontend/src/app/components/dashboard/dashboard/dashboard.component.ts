import { Component, inject, OnInit } from '@angular/core';
import { ExameService } from "../../../services/exame.service";
import { ProntuarioService } from "../../../services/prontuario.service";
import { PacienteService } from "../../../services/paciente.service";
import { NgxAnimatedCounterModule } from "@bugsplat/ngx-animated-counter";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgxAnimatedCounterModule
  ]
})
export class DashboardComponent implements OnInit {

  totalExames: number = 0;
  totalAtendimentos: number = 0;
  totalPacientes: number = 0;

  private exameService = inject(ExameService);
  private prontuarioService = inject(ProntuarioService);
  private pacienteService = inject(PacienteService);

  ngOnInit(): void {
    this.exibeTotais();
  }

  exibeTotais(): void {
    this.exameService.total().subscribe({next: totalExames => this.totalExames = totalExames});
    this.prontuarioService.total().subscribe({next: totalAtendimentos => this.totalAtendimentos = totalAtendimentos});
    this.pacienteService.total().subscribe({next: totalPacientes => this.totalPacientes = totalPacientes});
  }

}
