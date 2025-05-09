import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { ProntuarioService } from '../../../services/prontuario.service';
import { ExameService } from '../../../services/exame.service';
import {
  DecoracaoMensagem,
  ExibirMensagemService,
  Upload,
  UploadService,
  ViaCepService
} from "@andre.penteado/ngx-apcore";
import { lastValueFrom, Observable } from "rxjs"
import { Parentesco } from "../../../domain/enums/parentesco";
import { Prontuario } from "../../../domain/entities/prontuario";
import { Exame } from "../../../domain/entities/exame";
import { Paciente } from "../../../domain/entities/paciente";

@Component({
    selector: 'app-cadastro',
    templateUrl: './cadastro.component.html',
    styles: ``,
    standalone: false
})
export class CadastroComponent implements OnInit {

  formPacienteEnviado = false;
  formProntuarioEnviado = false;
  formExamesEnviado = false;

  parentescos: string[];
  enumParentescos = Parentesco;

  prontuarios: Prontuario[] = [];
  exames: Exame[] = [];

  objetoPaciente: Paciente = new Paciente();
  objetoArquivo: Upload = new Upload();

  // Formulário dados do paciente
  id = new FormControl(null);
  dataCadastro = new FormControl(null);
  usuarioCadastro = new FormControl(null);
  dataUltimaAtualizacao = new FormControl(null);
  usuarioUltimaAtualizacao = new FormControl(null);
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
    usuarioCadastro: this.usuarioCadastro,
    dataUltimaAtualizacao: this.dataUltimaAtualizacao,
    usuarioUltimaAtualizacao: this.usuarioUltimaAtualizacao,
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
    private viaCepService: ViaCepService,
    private exibirMensagem: ExibirMensagemService,
    private uploadService: UploadService
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
          this.exibirMensagem.showMessage(
            `CEP não encontrado ou incorreto`,
            "Pesquisar CEP",
            DecoracaoMensagem.INFO
          );
        }
        else {
          this.logradouro.setValue(endereco.logradouro);
          this.bairro.setValue(endereco.bairro);
          this.cidade.setValue(endereco.localidade);
          this.estado.setValue(endereco.uf);
        }
      }
    });
  }

  gravarPaciente(): void {
    this.formPacienteEnviado = true;
    if (this.formPaciente.valid) {
      this.formPaciente.controls.dataCadastro.setValue(new Date());
      this.pacienteService.gravar(this.formPaciente.value).subscribe({
        next: paciente => {
          this.objetoPaciente = paciente;
          this.formPaciente.reset();
          this.formPaciente.patchValue(paciente);
          this.exibirMensagem.showMessage(
            `Dados do paciente ${paciente.nome} gravados com sucesso`,
            'Gravar Paciente',
            DecoracaoMensagem.SUCESSO
          );
        }
      });
    }
    else {
      this.exibirMensagem.showMessage(
        'Preencha todos os dados obrigatórios antes de gravar os dados',
        'Dados Obrigatórios',
        DecoracaoMensagem.PRIMARIO
      );
    }
  }

  selecionarArquivo(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      this.objetoArquivo = new Upload();
      this.objetoArquivo.nome = file.name;
      this.objetoArquivo.tipoMime = file.type;
      this.objetoArquivo.tamanho = file.size;

      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.objetoArquivo.base64 = reader.result as string;
    }
  }

  downloadArquivo(exame: Exame): void {
    this.uploadService.buscar(exame.arquivo).subscribe(upload => {
      const link = document.createElement('a');
      link.href = upload.base64;
      link.download = upload.nome;
      link.click();
    });
  }

  async gravarExame() {
    this.formExamesEnviado = true;
    if (this.formExames.valid) {
      let upload$: Observable<Upload>;
      upload$ = this.uploadService.incluir(this.objetoArquivo);
      let upload = await lastValueFrom(upload$);

      this.formExames.controls.paciente.setValue(this.objetoPaciente);
      this.formExames.controls.arquivo.setValue(upload.uuid);
      this.exameService.incluir(this.formExames.value).subscribe({
        next: exame => {
          this.exames.unshift(exame);
          this.formExames.reset();
          this.formExamesEnviado = false;
          this.exibirMensagem.showMessage(
              'Arquivo de exame incluído com sucesso',
              'Gravar Exame',
              DecoracaoMensagem.SUCESSO
          );
        }
      });
    }
    else {
      this.exibirMensagem.showMessage(
          'Preencha todos os dados obrigatórios antes de gravar os dados',
          'Dados Obrigatórios',
          DecoracaoMensagem.PRIMARIO
      );
    }
  }

  excluirExame(exame: Exame): void {
    this.exibirMensagem
      .showConfirm(`Confirma a exclusão do exame ${exame.descricao}`, "Excluir?")
      .then((resposta) => {
        if (resposta.value) {
          this.exameService.excluir(exame.id).subscribe({
            next: () => this.pesquisar(exame.paciente.id)
          });
        }
      }
    );
  }

  gravarProntuario(): void {
    this.formProntuarioEnviado = true;
    if (this.formProntuario.valid) {
      this.formProntuario.controls.dataRegistro.setValue(new Date());
      this.formProntuario.controls.paciente.setValue(this.objetoPaciente);
      this.prontuarioService.incluir(this.formProntuario.value).subscribe({
        next: prontuario => {
          this.prontuarios.unshift(prontuario);
          this.formProntuario.reset();
          this.formProntuarioEnviado = false;
          this.exibirMensagem.showMessage(
            'Dados do atendimento incluído ao prontuário com sucesso',
            'Gravar Prontuário',
            DecoracaoMensagem.SUCESSO
          );
        }
      });
    }
    else {
      this.exibirMensagem.showMessage(
        'Preencha todos os dados obrigatórios antes de gravar os dados',
        'Dados Obrigatórios',
        DecoracaoMensagem.PRIMARIO
      );
    }
  }

  excluirProntuario(prontuario: Prontuario): void {
    this.exibirMensagem
      .showConfirm(`Confirma a exclusão do prontuário ${prontuario.id}`, "Excluir?")
      .then((resposta) => {
      if (resposta.value) {
        this.prontuarioService.excluir(prontuario.id).subscribe({
          next: () => this.pesquisar(prontuario.paciente.id),
          error: objetoErro => {
            this.exibirMensagem.showMessage(
                `${objetoErro.error.message}`,
                'Erro de processamento',
              DecoracaoMensagem.ERRO
            );
          }
        });
      }
    });
  }

}
