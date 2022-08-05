import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Parentesco } from 'src/app/models/enums/parentesco';
import { PacienteService } from '../../../services/paciente.service';
import { ViaCepService } from '../../../services/via-cep.service';
import {Prontuario} from '../../../models/prontuario';
import {ProntuarioService} from '../../../services/prontuario.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  formPacienteEnviado = false;
  formProntuarioEnviado = false;
  dataCadastroFormatada: Date = new Date();

  exibirMensagem = false;
  textoMensagem = "";
  headerMensagem = "";
  estiloMensagem = "bg-primary";

  prontuarios: Prontuario[] = [];

  id = new FormControl(null);
  dataCadastro = new FormControl(new Date(Date.now()));
  nome = new FormControl(null, Validators.required);
  cpf = new FormControl(null, Validators.required);
  dataNascimento = new FormControl(null);
  telefone = new FormControl(null, Validators.required);
  whatsapp = new FormControl(false);
  email = new FormControl(null);
  contatoEmergencia = new FormControl(null);
  parentescoContatoEmergencia = new FormControl(null);
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
  historiaMolestiaPregressa = new FormControl(null, Validators.required);
  remedios = new FormControl(null);
  objetivos = new FormControl(null);

  idProntuario = new FormControl(null);
  dataRegistro = new FormControl(new Date(Date.now()));
  atendimento = new FormControl(null, Validators.required);

  formPaciente = new FormGroup({
    id: this.id,
    dataCadastro: this.dataCadastro,
    nome: this.nome,
    cpf: this.cpf,
    dataNascimento: this.dataNascimento,
    telefone: this.telefone,
    whatsapp: this.whatsapp,
    email: this.email,
    contatoEmergencia: this.contatoEmergencia,
    parentescoContatoEmergencia: this.parentescoContatoEmergencia,
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

  formProntuario = new FormGroup({
    id: this.idProntuario,
    dataRegistro: this.dataRegistro,
    atendimento: this.atendimento
  });

  parentescos: string[];
  enumParentescos = Parentesco;

  constructor(
    private activedRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private prontuarioService: ProntuarioService,
    private viaCepService: ViaCepService
  ) {
    this.parentescos = Object.keys(Parentesco);
  }

  ngOnInit(): void {
    this.activedRoute.params.subscribe(params => {
      const id: number = params.id;
      if (id) {
        this.pacienteService.buscar(id).subscribe(paciente => {
          this.formPaciente.patchValue(paciente);
          this.dataCadastroFormatada = new Date(paciente.dataCadastro);
          this.prontuarioService.listarPorPaciente(paciente.id).subscribe(
              prontuarios => this.prontuarios = prontuarios
          );
        });
      }
    });
  }

  toDate(data: any): Date {
    return new Date(data);
  }

  consultaCep = (cep: string) => {
    cep = cep.replace('-', '');
    this.logradouro.setValue('');
    this.bairro.setValue('');
    this.cidade.setValue('');
    this.estado.setValue('');
    this.viaCepService.consultarCep(cep).subscribe({
      next: endereco => {
        if (endereco.erro) {
          this.headerMensagem = "Atenção"
          this.textoMensagem = "CEP não encontrado ou incorreto"
          this.estiloMensagem = "bg-warning";
          this.exibirMensagem = true;
        } else {
          this.logradouro.setValue(endereco.logradouro);
          this.bairro.setValue(endereco.bairro);
          this.cidade.setValue(endereco.localidade);
          this.estado.setValue(endereco.uf);
        }
      },
      error: () => {
        this.headerMensagem = "Erro de processamento"
        this.textoMensagem = "Erro ao consultar o CEP"
        this.estiloMensagem = "bg-danger";
        this.exibirMensagem = true;
      }
    });
  }

  gravarPaciente(): void {
    this.formPacienteEnviado = true;
    if (this.formPaciente.valid) {
      console.log(this.formPaciente.value);
      this.pacienteService.gravar(this.formPaciente.value).subscribe({
        next: paciente => {
          this.formPaciente.reset();
          this.formPaciente.patchValue(paciente);
          this.headerMensagem = "Paciente";
          this.textoMensagem = `Dados do paciente ${paciente.nome} gravados com sucesso`;
          this.estiloMensagem = "bg-success";
          this.exibirMensagem = true;
        error: objetoErro => {
          this.headerMensagem = "Erro de processamento"
          this.textoMensagem = "Erro ao gravar os dados do paciente"
          this.estiloMensagem = "bg-danger";
          this.exibirMensagem = true;
        }
      }
    });
    }
    else {
      this.headerMensagem = "Atenção"
      this.textoMensagem = "Dados obrigatórios não foram todos preenchidos"
      this.estiloMensagem = "bg-warning";
      this.exibirMensagem = true;
    }
  }

  gravarProntuario() {
    this.formProntuarioEnviado = true;
    if (this.formProntuario.valid) {
      this.headerMensagem = "Prontuário";
      this.textoMensagem = "Dados do atendimento incluído ao prontuário com sucesso";
      this.estiloMensagem = "bg-success";
      this.exibirMensagem = true;
    }
    else {
      this.headerMensagem = "Prontuário";
      this.textoMensagem = "Dados obrigatórios não foram todos preenchidos";
      this.estiloMensagem = "bg-warning";
      this.exibirMensagem = true;
    }
  }
}
