import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../../services/paciente.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  formEnviado: boolean = false;
  hoje: string =this.datePipe.transform(Date.now(), "EEEE, dd 'de' MMMM 'de' yyyy");

  id = new FormControl(null);
  cadastro = new FormControl(Date.now);
  nome = new FormControl(null, Validators.required);
  cpf = new FormControl(null, Validators.required);
  nascimento = new FormControl(null);
  telefone = new FormControl(null, Validators.required);
  whatsapp = new FormControl(false);
  email = new FormControl(null);
  cep = new FormControl(null);
  logradouro = new FormControl(null);
  numero = new FormControl(null);
  bairro = new FormControl(null);
  cidade = new FormControl(null);
  estado = new FormControl(null);
  profissao = new FormControl(null);
  vencimento = new FormControl(null);
  frequencia = new FormControl(0);
  queixa = new FormControl(null, Validators.required);
  remedios = new FormControl(null);
  objetivos = new FormControl(null);

  formPaciente = new FormGroup({
    id: this.id,
    cadastro: this.cadastro,
    nome: this.nome,
    cpf: this.cpf,
    nascimento: this.nascimento,
    telefone: this.telefone,
    whatsapp: this.whatsapp,
    email: this.email,
    cep: this.cep,
    logradouro: this.logradouro,
    numero: this.numero,
    bairro: this.bairro,
    cidade: this.cidade,
    estado: this.estado,
    profissao: this.profissao,
    vencimento: this.vencimento,
    frequencia: this.frequencia,
    queixa: this.queixa,
    remedios: this.remedios,
    objetivos: this.objetivos
    });

  constructor(
    private pacienteService: PacienteService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  gravar(): void {
    this.formEnviado = true;
    if (this.formPaciente.valid) {
      console.log(this.formPaciente.value);
      Swal.fire("Paciente gravado com sucesso");
    }
  }

}