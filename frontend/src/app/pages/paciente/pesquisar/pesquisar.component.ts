import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Datatables, ExibirMensagemService, LoginService } from "@andre.penteado/ngx-apcore";
import { PacienteService } from "../../../services/paciente.service";
import { ExameService } from "../../../services/exame.service";
import { ProntuarioService } from "../../../services/prontuario.service";
import { Paciente } from "../../../domain/entities/paciente";
import { PREFIXO_PERFIL_SISTEMA } from "../../../config/layout";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgxUiLoaderModule
  ]
})
export class PesquisarComponent implements OnInit {

  protected readonly PREFIXO_PERFIL_SISTEMA = PREFIXO_PERFIL_SISTEMA;

  lista: Paciente[] = [];
  totalExames: number = 0;
  totalAtendimentos: number = 0;

  private pacienteService = inject(PacienteService);
  private exameService = inject(ExameService);
  private prontuarioService = inject(ProntuarioService);
  private exibirMensagem = inject(ExibirMensagemService);
  private uiLoaderService = inject(NgxUiLoaderService);
  protected loginService = inject(LoginService);
  private router = inject(Router);

  ngOnInit(): void {
    this.pesquisar();
    this.exibeTotais();
  }

  pesquisar(): void {
    this.uiLoaderService.startLoader('paciente-pesquisar');
    this.pacienteService.listar().subscribe({
      next: listaPacientes => {
        this.lista = listaPacientes;
        setTimeout(() => {
          $('#datatables-pesquisar-pacientes').DataTable(Datatables.config);
          this.uiLoaderService.stopLoader('paciente-pesquisar');
        }, 5);
      },
      error: () => {
        this.uiLoaderService.stopLoader('paciente-pesquisar');
      }
    });
  }

  exibeTotais(): void {
    this.exameService.total().subscribe({ next: totalExames => this.totalExames = totalExames });
    this.prontuarioService.total().subscribe({ next: totalAtendimentos => this.totalAtendimentos = totalAtendimentos });
  }

  incluir(): void {
    this.router.navigate([`/paciente/cadastro`]);
  }

  editar(paciente: Paciente): void {
    this.router.navigate([`/paciente/cadastro/${paciente.id}`]);
  }

  excluir(paciente: Paciente): void {
    this.exibirMensagem
      .showConfirm(`Confirma a exclusão do paciente ${paciente.nome}`, "Excluir?")
      .then((resposta) => {
        if (resposta.value) {
        this.pacienteService.excluir(paciente.id).subscribe({
          next: () => {
            window.location.reload();
          }
        });
      }
    });
  }

}
