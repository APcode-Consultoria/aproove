import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { ProntuarioService } from '../../../services/prontuario.service';
import { ExameService } from '../../../services/exame.service';
import {
  CadastroBaseComponent,
  DecoracaoMensagem,
  LoginService,
  Upload,
  UploadService,
  ViaCepService
} from "@andre.penteado/ngx-apcore";
import { lastValueFrom, Observable } from "rxjs"
import { Parentesco } from "../../../domain/enums/parentesco";
import { Prontuario } from "../../../domain/entities/prontuario";
import { Exame } from "../../../domain/entities/exame";
import { Paciente } from "../../../domain/entities/paciente";
import { CommonModule } from "@angular/common";
import { NgxMaskDirective } from "ngx-mask";
import { PREFIXO_PERFIL_SISTEMA } from "../../../config/layout";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgxMaskDirective
  ]
})
export class CadastroComponent extends CadastroBaseComponent<Paciente> {

  protected readonly PREFIXO_PERFIL_SISTEMA = PREFIXO_PERFIL_SISTEMA;

  // Estado de envio dos subformulários das listas. O do formulário do paciente é o
  // `formEnviado` herdado da base.
  formProntuarioEnviado = false;
  formExamesEnviado = false;

  parentescos: string[];
  enumParentescos = Parentesco;

  // Listas `persistencia: independente`: arrays comuns, não FormArray. Cada item já
  // foi persistido pelo service do filho.
  prontuarios: Prontuario[] = [];
  exames: Exame[] = [];
  responsaveis: string[] = [];

  objetoArquivo: Upload = new Upload();

  // Formulário do paciente
  id = new FormControl(null);
  dataCadastro = new FormControl(null);
  usuarioCadastro = new FormControl(null);
  dataUltimaAtualizacao = new FormControl(null);
  usuarioUltimaAtualizacao = new FormControl(null);
  nome = new FormControl(null, Validators.required);
  cpf = new FormControl(null, null);
  dataNascimento = new FormControl(null);
  telefone = new FormControl(null, null);
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
  queixaPrincipal = new FormControl(null, null);
  historiaMolestiaPregressa = new FormControl(null, null);
  remedios = new FormControl(null);
  objetivos = new FormControl(null);
  responsavel = new FormControl(null);
  observacao = new FormControl(null);
  protected readonly form = new FormGroup({
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
    objetivos: this.objetivos,
    responsavel: this.responsavel,
    observacao: this.observacao
  });

  // Subformulário da lista de exames — fora do `form` principal, para os campos
  // obrigatórios dele não travarem o Gravar do paciente.
  idExame = new FormControl(null);
  descricaoExame = new FormControl(null, Validators.required);
  arquivoExame = new FormControl(null, Validators.required);
  pacienteExame = new FormControl(null);
  arquivoUpload = new FormControl(null);
  formExames = new FormGroup({
    id: this.idExame,
    descricao: this.descricaoExame,
    arquivoExame: this.arquivoExame,
    paciente: this.pacienteExame,
    arquivo: this.arquivoUpload
  });

  // Subformulário da lista de prontuários
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

  protected loginService = inject(LoginService);

  private pacienteService = inject(PacienteService);
  private prontuarioService = inject(ProntuarioService);
  private exameService = inject(ExameService);
  private viaCepService = inject(ViaCepService);
  private uploadService = inject(UploadService);

  protected readonly tituloGravar = "Gravar Paciente";
  protected readonly rotulo = 'paciente';

  constructor() {
    super();
    this.parentescos = Object.keys(Parentesco);
  }

  protected buscar(id: number): Observable<Paciente> {
    return this.pacienteService.buscar(id);
  }

  protected incluirEntidade(valor: any): Observable<Paciente> {
    return this.pacienteService.gravar(valor);
  }

  protected alterarEntidade(valor: any): Observable<Paciente> {
    return this.pacienteService.gravar(valor);
  }

  protected mensagemGravarSucesso(paciente: Paciente): string {
    return `Dados do paciente ${paciente.nome} gravados com sucesso`;
  }

  protected override carregarListasAuxiliares(): void {
    if (!this.loginService.hasRole(`${PREFIXO_PERFIL_SISTEMA}DIRETOR`)) {
      return;
    }
    this.pacienteService.listar().subscribe(pacientes => {
      this.responsaveis = [...new Set(pacientes.map(paciente => paciente.responsavel).filter(Boolean))].sort();
    });
  }

  protected override novaEntidade(): Paciente {
    return new Paciente();
  }

  /**
   * Recarrega as listas independentes sempre que o paciente corrente muda. Em modo de
   * inclusão não há paciente ainda: as listas ficam vazias e o responsável assume o
   * usuário logado.
   */
  protected override aposCarregar(paciente: Paciente): void {
    if (!paciente?.id) {
      this.exames = [];
      this.prontuarios = [];
      this.responsavel.setValue(this.loginService.getUserLogin()?.login ?? null);
      return;
    }

    this.exameService.listarPorPaciente(paciente.id).subscribe(exames => this.exames = exames);
    this.prontuarioService.listarPorPaciente(paciente.id).subscribe(prontuarios => this.prontuarios = prontuarios);
  }

  tituloFormulario(): string {
    return this.incluir ? 'Novo paciente' : 'Editar paciente';
  }

  subtituloFormulario(): string {
    return 'Mantenha dados cadastrais, exames e registros de prontuário do paciente.';
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

  async adicionarExame(): Promise<void> {
    this.formExamesEnviado = true;

    if (!this.registroGravado() || !this.subformularioValido(this.formExames)) {
      return;
    }

    const upload = await lastValueFrom(this.uploadService.incluir(this.objetoArquivo));
    this.pacienteExame.setValue(this.entidade as any);
    this.arquivoUpload.setValue(upload.uuid as any);

    console.info(`Incluir exame ${this.formExames.value.descricao} do paciente de ID #${this.entidade.id}`);
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

  excluirExame(exame: Exame): void {
    this.exibirMensagem
      .showConfirm(`Confirma a exclusão do exame ${exame.descricao}`, "Excluir?")
      .then(resposta => {
        if (!resposta.value) {
          return;
        }

        console.info(`Excluir exame de ID #${exame.id}`);
        this.exameService.excluir(exame.id).subscribe({
          next: () => this.exames = this.exames.filter(e => e.id !== exame.id)
        });
      });
  }

  adicionarProntuario(): void {
    this.formProntuarioEnviado = true;

    if (!this.registroGravado() || !this.subformularioValido(this.formProntuario)) {
      return;
    }

    this.dataRegistro.setValue(new Date() as any);
    this.pacienteProntuario.setValue(this.entidade as any);

    console.info(`Incluir prontuário do paciente de ID #${this.entidade.id}`);
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

  excluirProntuario(prontuario: Prontuario): void {
    this.exibirMensagem
      .showConfirm(`Confirma a exclusão do prontuário ${prontuario.id}`, "Excluir?")
      .then(resposta => {
        if (!resposta.value) {
          return;
        }

        console.info(`Excluir prontuário de ID #${prontuario.id}`);
        this.prontuarioService.excluir(prontuario.id).subscribe({
          next: () => this.prontuarios = this.prontuarios.filter(p => p.id !== prontuario.id)
        });
      });
  }

}
