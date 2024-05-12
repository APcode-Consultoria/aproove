import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DATATABLES_OPTIONS, ExibirMensagemService } from "@andrepenteado/ngx-apcore";
import { Paciente } from "../../../models/paciente";
import { PacienteService } from "../../../services/paciente.service";
import { ngxLoadingAnimationTypes } from "ngx-loading";

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  styleUrls: ['./pesquisar.component.scss']
})
export class PesquisarComponent implements OnInit {

  aguardar: boolean = true;

  lista: Paciente[] = [];

  constructor(
    private pacienteService: PacienteService,
    private exibirMensagem: ExibirMensagemService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar(): void {
    this.pacienteService.listar().subscribe({
      next: listaPacientes => {
        this.lista = listaPacientes;
        this.aguardar = false;
        setTimeout(() => {
          $('#datatable-pesquisar-paciente').DataTable(DATATABLES_OPTIONS);
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

  protected readonly ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
}
