import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import Swal from 'sweetalert2';
import {Subject} from 'rxjs';
import {Core} from '../../../config/core';
import {DecoracaoMensagem, ExibeMensagemComponent} from '../../core/components/exibe-mensagem.component';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  styleUrls: ['./pesquisar.component.scss']
})
export class PesquisarComponent implements OnInit, OnDestroy {

  @ViewChild("exibeMensagem")
  exibeMensagem: ExibeMensagemComponent = new ExibeMensagemComponent();

  dtOptions: DataTables.Settings = Core.DATATABLES_OPTIONS;
  dtTrigger: Subject<any> = new Subject<any>();

  lista: Paciente[];

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pesquisar();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  pesquisar(): void {
    this.pacienteService.listar().subscribe({
      next: listaPacientes => {
        this.lista = listaPacientes,
        this.dtTrigger.next(null);
      },
      error: objetoErro => {
        this.exibeMensagem.show(
          `${objetoErro.error.message}`,
          DecoracaoMensagem.ERRO,
          "Erro de processamento"
        );
      }
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
        this.pacienteService.excluir(paciente.id).subscribe({
          next: () => this.pesquisar(),
          error: objetoErro => {
            this.exibeMensagem.show(
              `${objetoErro.error.message}`,
              DecoracaoMensagem.ERRO,
              "Erro de processamento"
            )
          }
        });
      }
    });
  }
}
