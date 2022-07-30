import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  styleUrls: ['./pesquisar.component.scss']
})
export class PesquisarComponent implements OnInit {

  lista: Paciente[];

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar(): void {
    this.pacienteService.listar().subscribe({
      next: listaPacientes => this.lista = listaPacientes,
      error: () => this.toastrService.error("Erro ao pesquisar pacientes", "Erro de processamento")
    });
  }

  incluir(): void {
    this.router.navigate([`/paciente/cadastro`]);
  }

  editar(paciente): void {
    this.router.navigate([`/paciente/cadastro/${paciente.id}`]);
  }

  excluir(paciente): void {
    Swal.fire({
      title: "Excluir?",
      text: `Confirma a exclusão do paciente ${paciente.nome}`,
      icon: "question",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "<i class='fa fa-trash'></i> Sim, Excluir",
      cancelButtonText: "Cancelar"
    }).then((resposta) => {
      if (resposta.value) {
        this.pacienteService.excluir(paciente.id).subscribe(() => {
          this.pesquisar();
        });
      }
    });
  }

}
