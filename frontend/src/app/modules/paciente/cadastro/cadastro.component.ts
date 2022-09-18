import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Parentesco} from 'src/app/models/enums/parentesco';
import {PacienteService} from '../../../services/paciente.service';
import {ViaCepService} from '../../../services/via-cep.service';
import {Prontuario} from '../../../models/prontuario';
import {ProntuarioService} from '../../../services/prontuario.service';
import {DecoracaoMensagem, ExibeMensagemComponent} from '../../core/components/exibe-mensagem.component';
import {Paciente} from '../../../models/paciente';
import {ExameService} from '../../../services/exame.service';
import {Exame} from '../../../models/exame';
import {Arquivo} from '../../../models/arquivo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  @ViewChild('exibeMensagem')
  exibeMensagem: ExibeMensagemComponent = new ExibeMensagemComponent();

  formPacienteEnviado = false;
  formProntuarioEnviado = false;
  formExamesEnviado = false;

  dataCadastroFormatada: Date = new Date();

  parentescos: string[];
  enumParentescos = Parentesco;

  prontuarios: Prontuario[] = [];
  exames: Exame[] = [];

  objetoPaciente: Paciente;
  objetoArquivo: Arquivo;

  // Formulário dados do paciente
  id = new FormControl(null);
  dataCadastro = new FormControl(null);
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
  complemento = new FormControl(null);
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
    complemento: this.complemento,
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

  // Formulário exames
  idExame = new FormControl(null);
  descricaoExame = new FormControl(null, Validators.required);
  arquivoExame = new FormControl(null, Validators.required);
  pacienteExame = new FormControl(null);
  arquivoUpload = new FormControl(null);
  formExames = new FormGroup( {
    id: this.idExame,
    descricao: this.descricaoExame,
    arquivoExame: this.arquivoExame,
    paciente: this.pacienteExame,
    arquivo: this.arquivoUpload
  });

  // Formulário prontuário
  idProntuario = new FormControl(null);
  dataRegistro = new FormControl(null);
  atendimento = new FormControl(null, Validators.required);
  pacienteProntuario = new FormControl(null);
  formProntuario = new FormGroup({
    id: this.idProntuario,
    dataRegistro: this.dataRegistro,
    atendimento: this.atendimento,
    paciente: this.pacienteProntuario
  });

  constructor(
    private activedRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private prontuarioService: ProntuarioService,
    private exameService: ExameService,
    private viaCepService: ViaCepService
  ) {
    this.parentescos = Object.keys(Parentesco);
  }

  ngOnInit(): void {
    this.activedRoute.params.subscribe(params => {
      const id: number = params.id;
      if (id) {
        this.pesquisar(id);
      }
    });
  }

  pesquisar(id: number): void {
    this.pacienteService.buscar(id).subscribe(paciente => {
      this.objetoPaciente = paciente;
      this.formPaciente.patchValue(paciente);
      this.dataCadastroFormatada = new Date(paciente.dataCadastro);
      this.prontuarioService.listarPorPaciente(paciente.id).subscribe(
          prontuarios => this.prontuarios = prontuarios
      );
      this.exameService.listarPorPaciente(paciente.id).subscribe(
          exames => this.exames = exames
      );
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
            'CEP não encontrado ou incorreto',
            DecoracaoMensagem.INFO,
            'Pesquisar CEP',
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
          'Não foi possível consultar o CEP',
          DecoracaoMensagem.ERRO,
          'Erro de processamento'
        );
      }
    });
  }

  gravarPaciente(): void {
    this.formPacienteEnviado = true;
    if (this.formPaciente.valid) {
      this.formPaciente.controls.dataCadastro.setValue(new Date());
      console.log(this.formPaciente.value);
      this.pacienteService.gravar(this.formPaciente.value).subscribe({
        next: paciente => {
          this.objetoPaciente = paciente;
          this.formPaciente.reset();
          this.formPaciente.patchValue(paciente);
          this.exibeMensagem.show(
            `Dados do paciente ${paciente.nome} gravados com sucesso`,
            DecoracaoMensagem.SUCESSO,
            'Gravar Paciente'
          );
        },
        error: objetoErro => {
          this.exibeMensagem.show(
            `${objetoErro.error.message}`,
            DecoracaoMensagem.ERRO,
            'Erro de processamento'
          );
        }
      });
    }
    else {
      this.exibeMensagem.show(
        'Preencha todos os dados obrigatórios antes de gravar os dados',
        DecoracaoMensagem.PRIMARIO,
        'Dados Obrigatórios'
      );
    }
  }

  selecionarArquivo(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      this.objetoArquivo = new Arquivo();
      this.objetoArquivo.nome = file.name;
      this.objetoArquivo.tipoMime = file.type;
      this.objetoArquivo.modificado = file.lastModified;
      this.objetoArquivo.tamanho = file.size;

      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.objetoArquivo.base64 = reader.result as string;
    }
  }

  downloadArquivo(exame: Exame): void {
    const link = document.createElement('a');
    link.href = exame.arquivo.base64;
    link.download = exame.arquivo.nome;
    link.click();
  }

  gravarExame(): void {
    this.formExamesEnviado = true;
    if (this.formExames.valid) {
      this.formExames.controls.paciente.setValue(this.objetoPaciente);
      this.formExames.controls.arquivo.setValue(this.objetoArquivo);
      console.log(this.formExames.value);
      this.exameService.incluir(this.formExames.value).subscribe({
        next: exame => {
          this.exames.unshift(exame);
          this.formExames.reset();
          this.formExamesEnviado = false;
          this.exibeMensagem.show(
              'Arquivo de exame incluído com sucesso',
              DecoracaoMensagem.SUCESSO,
              'Gravar Exame'
          );
        },
        error: objetoErro => {
          this.exibeMensagem.show(
              `${objetoErro.error.message}`,
              DecoracaoMensagem.ERRO,
              'Erro de processamento'
          );
        }
      });
    }
    else {
      this.exibeMensagem.show(
          'Preencha todos os dados obrigatórios antes de gravar os dados',
          DecoracaoMensagem.PRIMARIO,
          'Dados Obrigatórios'
      );
    }
  }

  excluirExame(exame: Exame): void {
    Swal.fire({
      title: 'Excluir?',
      text: `Confirma a exclusão do exame ${exame.descricao}`,
      icon: 'question',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: '<i class=\'fa fa-trash\'></i> Sim, Excluir',
      cancelButtonText: 'Cancelar'
    }).then((resposta) => {
      if (resposta.value) {
        this.exameService.excluir(exame.id).subscribe({
          next: () => this.pesquisar(exame.paciente.id),
          error: objetoErro => {
            this.exibeMensagem.show(
                `${objetoErro.error.message}`,
                DecoracaoMensagem.ERRO,
                'Erro de processamento'
            );
          }
        });
      }
    });
  }

  gravarProntuario(): void {
    this.formProntuarioEnviado = true;
    if (this.formProntuario.valid) {
      this.formProntuario.controls.dataRegistro.setValue(new Date());
      this.formProntuario.controls.paciente.setValue(this.objetoPaciente);
      console.log(this.formProntuario.value);
      this.prontuarioService.incluir(this.formProntuario.value).subscribe({
        next: prontuario => {
          this.prontuarios.unshift(prontuario);
          this.formProntuario.reset();
          this.formProntuarioEnviado = false;
          this.exibeMensagem.show(
            'Dados do atendimento incluído ao prontuário com sucesso',
            DecoracaoMensagem.SUCESSO,
            'Gravar Prontuário'
          );
        },
        error: objetoErro => {
          this.exibeMensagem.show(
            `${objetoErro.error.message}`,
            DecoracaoMensagem.ERRO,
            'Erro de processamento'
          );
        }
      });
    }
    else {
      this.exibeMensagem.show(
        'Preencha todos os dados obrigatórios antes de gravar os dados',
        DecoracaoMensagem.PRIMARIO,
        'Dados Obrigatórios'
      );
    }
  }

  excluirProntuario(prontuario: Prontuario): void {
    Swal.fire({
      title: 'Excluir?',
      text: `Confirma a exclusão do prontuário #${prontuario.id}`,
      icon: 'question',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: '<i class=\'fa fa-trash\'></i> Sim, Excluir',
      cancelButtonText: 'Cancelar'
    }).then((resposta) => {
      if (resposta.value) {
        this.prontuarioService.excluir(prontuario.id).subscribe({
          next: () => this.pesquisar(prontuario.paciente.id),
          error: objetoErro => {
            this.exibeMensagem.show(
                `${objetoErro.error.message}`,
                DecoracaoMensagem.ERRO,
                'Erro de processamento'
            );
          }
        });
      }
    });
  }

}
