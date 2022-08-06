import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Parentesco} from 'src/app/models/enums/parentesco';
import {PacienteService} from '../../../services/paciente.service';
import {ViaCepService} from '../../../services/via-cep.service';
import {Prontuario} from '../../../models/prontuario';
import {ProntuarioService} from '../../../services/prontuario.service';
import {DecoracaoMensagem, ExibeMensagemComponent} from '../../core/components/exibe-mensagem.component';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  @ViewChild("exibeMensagem")
  exibeMensagem: ExibeMensagemComponent = new ExibeMensagemComponent();

  formPacienteEnviado = false;
  formProntuarioEnviado = false;

  dataCadastroFormatada: Date = new Date();

  parentescos: string[];
  enumParentescos = Parentesco;

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
          this.exibeMensagem.show(
            "CEP não encontrado ou incorreto",
            DecoracaoMensagem.INFO,
            "Pesquisar CEP",
          );
        } else {
          this.logradouro.setValue(endereco.logradouro);
          this.bairro.setValue(endereco.bairro);
          this.cidade.setValue(endereco.localidade);
          this.estado.setValue(endereco.uf);
        }
      },
      error: () => {
        this.exibeMensagem.show(
          "Não foi possível consultar o CEP",
          DecoracaoMensagem.ERRO,
          "Erro de processamento"
        )
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
          this.exibeMensagem.show(
            `Dados do paciente ${paciente.nome} gravados com sucesso`,
            DecoracaoMensagem.SUCESSO,
            "Gravar Paciente"
          )
        error: objetoErro => {
          this.exibeMensagem.show(
            `Não foi possível gravar os dados do paciente: ${objetoErro.value.error()}`,
            DecoracaoMensagem.ERRO,
            "Erro de processamento"
          )
        }
      }
    });
    }
    else {
      this.exibeMensagem.show(
        "Preencha todos os dados obrigatórios antes de gravar os dados",
        DecoracaoMensagem.PRIMARIO,
        "Dados Obrigatórios"
      )
    }
  }

  gravarProntuario(): void {
    this.formProntuarioEnviado = true;
    if (this.formProntuario.valid) {
      console.log(this.formProntuario.value);
      this.prontuarioService.incluir(this.formProntuario.value).subscribe({
        next: prontuario => {
          this.formProntuario.reset();
          this.formProntuario.patchValue(prontuario);
          this.exibeMensagem.show(
            "Dados do atendimento incluído ao prontuário com sucesso",
            DecoracaoMensagem.SUCESSO,
            "Gravar Prontuário"
          )
          error: objetoErro => {
            this.exibeMensagem.show(
              `Não foi possível gravar os dados do prontuário: ${objetoErro.value.error()}`,
              DecoracaoMensagem.ERRO,
              "Erro de processamento"
            )
          }
        }
      })
    }
    else {
      this.exibeMensagem.show(
        "Preencha todos os dados obrigatórios antes de gravar os dados",
        DecoracaoMensagem.PRIMARIO,
        "Dados Obrigatórios"
      )
    }
  }
}
