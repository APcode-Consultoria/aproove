import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Datatables, ExibirMensagemService, FloatingButtonComponent, LoginService } from "@andre.penteado/ngx-apcore";
import { PacienteService } from "../../../services/paciente.service";
import { Paciente } from "../../../domain/entities/paciente";
import { NgxSpinnerComponent, NgxSpinnerService } from "ngx-spinner";
import { PREFIXO_PERFIL_SISTEMA } from "../../../config/layout";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  styles: ``,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgxSpinnerComponent,
    FloatingButtonComponent
  ]
})
export class PesquisarComponent implements OnInit {

  protected readonly PREFIXO_PERFIL_SISTEMA = PREFIXO_PERFIL_SISTEMA;

  lista: Paciente[] = [];

  private pacienteService = inject(PacienteService);
  private exibirMensagem = inject(ExibirMensagemService);
  private spinnerService = inject(NgxSpinnerService);
  protected loginService = inject(LoginService);
  private router = inject(Router);

  ngOnInit(): void {
    this.spinnerService.show();
    this.pesquisar();
  }

  pesquisar(): void {
    this.pacienteService.listar().subscribe({
      next: listaPacientes => {
        this.lista = listaPacientes;
        this.spinnerService.hide();
        setTimeout(() => {
          $('#datatable-pesquisar-paciente').DataTable(Datatables.config);
        }, 5);
      }
    });
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
