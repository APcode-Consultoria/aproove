import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from '../../../services/paciente.service';
import { ViaCepService } from '../../../services/via-cep.service';
import { Parentesco } from 'src/app/models/enums/parentesco';

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

  parentescos: string[];
  enumParentescos = Parentesco;

  constructor(
    private pacienteService: PacienteService,
    private viaCepService: ViaCepService,
    private datePipe: DatePipe,
    private toastrService: ToastrService
  ) { 
    this.parentescos = Object.keys(Parentesco);
  }

  ngOnInit(): void {
  }

  consultaCep(cep: string) {
    cep = cep.replace("-", "");
    this.logradouro.setValue("");
    this.bairro.setValue("");
    this.cidade.setValue("");
    this.estado.setValue("");
    this.viaCepService.consultarCep(cep).subscribe(
      endereco => {
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
      console.log(this.formPaciente.value);
      this.pacienteService.gravar(this.formPaciente.value).subscribe(
        paciente => {
          this.formPaciente.reset();
          this.formPaciente.patchValue(paciente);
          this.toastrService.success(`Dados do paciente ${paciente.nome} gravados com sucesso`, "Cadastro");
        },
        objetoErro => {
          this.toastrService.error(objetoErro.error.message, "Erro de Processamento");
        }
      );
    }
    else {
      this.toastrService.warning("Dados obrigatórios não foram todos preenchidos", "Atenção");
    }
  }

}