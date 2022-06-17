import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../../services/paciente.service';
import { ViaCepService } from '../../../services/via-cep.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  formEnviado: boolean = false;
  hoje: string =this.datePipe.transform(Date.now(), "EEEE, dd 'de' MMMM 'de' yyyy");

  id = new FormControl(null);
  dataCadastro = new FormControl(Date.now);
  nome = new FormControl(null, Validators.required);
  cpf = new FormControl(null, Validators.required);
  dataNascimento = new FormControl(null);
  telefone = new FormControl(null, Validators.required);
  whatsapp = new FormControl(false);
  email = new FormControl(null);
  contatoEmergencial = new FormControl(null);
  parentescoContatoEmergencial = new FormControl(null);
  cep = new FormControl(null);
  logradouro = new FormControl(null);
  numeroLogradouro = new FormControl(null);
  bairro = new FormControl(null);
  cidade = new FormControl(null);
  estado = new FormControl(null);
  profissao = new FormControl(null);
  diaVencimento = new FormControl(null);
  frequenciaSemanal = new FormControl(0);
  queixaPrincipal = new FormControl(null, Validators.required);
  historiaMolestiaPregressa = new FormControl(null);
  remedios = new FormControl(null);
  objetivos = new FormControl(null);

  formPaciente = new FormGroup({
    id: this.id,
    dataCadastro: this.dataCadastro,
    nome: this.nome,
    cpf: this.cpf,
    dataNascimento: this.dataNascimento,
    telefone: this.telefone,
    whatsapp: this.whatsapp,
    email: this.email,
    contatoEmergencial: this.contatoEmergencial,
    parentescoContatoEmergencial: this.parentescoContatoEmergencial,
    cep: this.cep,
    logradouro: this.logradouro,
    numeroLogradouro: this.numeroLogradouro,
    bairro: this.bairro,
    cidade: this.cidade,
    estado: this.estado,
    profissao: this.profissao,
    diaVencimento: this.diaVencimento,
    frequenciaSemanal: this.frequenciaSemanal,
    queixaPrincipal: this.queixaPrincipal,
    historiaMolestiaPregressa: this.historiaMolestiaPregressa,
    remedios: this.remedios,
    objetivos: this.objetivos
  });

  constructor(
    private pacienteService: PacienteService,
    private viaCepService: ViaCepService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
  }

  consultaCep(cep: string) {
    cep = cep.replace("-", "");
    this.viaCepService.consultarCep(cep)
    .subscribe(
      endereco => {
        console.log(endereco);
        if (endereco.erro) {
          this.toastrService.warning('CEP não encontrado', 'Atenção');
        }
        else {
          this.logradouro.setValue(endereco.logradouro);
          this.bairro.setValue(endereco.bairro);
          this.cidade.setValue(endereco.localidade);
          this.estado.setValue(endereco.uf);
        }
      },
      error => {
        this.toastrService.error('Erro ao consultar o CEP', 'Erro inesperado');
      }
    );
  }

  gravar(): void {
    this.formEnviado = true;
    if (this.formPaciente.valid) {
      this.toastrService.success("Dados do paciente gravados com sucesso!", "Cadastro");
    }
    else {
      this.toastrService.error("Dados preenchidos incompletos!", "Erro");
    }
  }

}