import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { ProntuarioService } from '../../../services/prontuario.service';
import { ExameService } from '../../../services/exame.service';
import { ServicoService } from '../../../services/servico.service';
import { ServicoContratadoService } from '../../../services/servico-contratado.service';
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
import { Servico } from "../../../domain/entities/servico";
import { ServicoContratado } from "../../../domain/entities/servico-contratado";
import { Periodicidade } from "../../../domain/enums/periodicidade";
import { DIAS_SEMANA, DIA_SEMANA_LABELS } from "../../../domain/enums/dia-semana";
import { ConfigCrud, resolverPerfil } from "../../../config/perfis-crud";
import { PERFIS_PACIENTE } from "../paciente.perfis";
import { CommonModule } from "@angular/common";
import { NgxMaskDirective } from "ngx-mask";
import { PREFIXO_PERFIL_SISTEMA } from "../../../config/layout";

// Mascaras dos campos de digitos, aplicadas no template por binding. Ficam aqui, e nao
// como literal no HTML, para o teste de regressao validar exatamente a mascara da tela.
//
// A do telefone tem duas alternativas porque fixo tem 10 digitos e celular 11: com a
// mascara unica de 11 o ngx-mask reprovava todo telefone fixo, e como o Bootstrap so
// destaca campo invalido pela validade nativa do HTML, o Gravar era recusado sem
// apontar o culpado.
export const MASCARA_CPF = "000.000.000-00";
export const MASCARA_TELEFONE = "(00) 0000-0000||(00) 00000-0000";
export const MASCARA_CEP = "00000-000";
// Mascara de moeda do valor contratado. Declarada aqui, e nao importada do cadastro de
// servico, para nao acoplar dois CRUDs por uma constante de template.
export const MASCARA_MOEDA = "separator.2";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
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

  protected readonly mascaraCpf = MASCARA_CPF;
  protected readonly mascaraTelefone = MASCARA_TELEFONE;
  protected readonly mascaraCep = MASCARA_CEP;
  protected readonly mascaraMoeda = MASCARA_MOEDA;

  protected readonly Periodicidade = Periodicidade;
  protected readonly diasSemana = DIAS_SEMANA;
  protected readonly diaSemanaLabels = DIA_SEMANA_LABELS;

  // Estado de envio dos subformulários das listas. O do formulário do paciente é o
  // `formEnviado` herdado da base.
  formProntuarioEnviado = false;
  formExamesEnviado = false;
  formServicoContratadoEnviado = false;

  parentescos: string[];
  enumParentescos = Parentesco;

  // Listas `persistencia: independente`: arrays comuns, não FormArray. Cada item já
  // foi persistido pelo service do filho.
  prontuarios: Prontuario[] = [];
  exames: Exame[] = [];
  servicosContratados: ServicoContratado[] = [];
  responsaveis: string[] = [];

  // Alimenta o combo de serviço do subformulário de contratação.
  servicos: Servico[] = [];

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

  // Subformulário da lista de serviços contratados — fora do `form` principal, como os
  // demais, para os campos obrigatórios dele não travarem o Gravar do paciente.
  servicoContratacao = new FormControl<Servico | null>(null, Validators.required);
  inicioContratacao = new FormControl(null, Validators.required);
  valorContratado = new FormControl(null);
  // Um controle por ocorrência da frequência do serviço escolhido. A quantidade vem de
  // `frequenciaPeriodicidade` e só é conhecida depois da escolha, por isso FormArray.
  frequencias = new FormArray<FormControl<any>>([]);
  formServicoContratado = new FormGroup({
    servico: this.servicoContratacao,
    inicioContratacao: this.inicioContratacao,
    valorContratado: this.valorContratado,
    frequencias: this.frequencias
  });

  protected loginService = inject(LoginService);

  // `lista.acoes` de servicos_contratados varia por perfil (só o diretor exclui), então
  // o CRUD ganha configuração por perfil resolvida na construção do componente.
  protected readonly config: ConfigCrud = resolverPerfil(PERFIS_PACIENTE, this.loginService);

  private pacienteService = inject(PacienteService);
  private prontuarioService = inject(ProntuarioService);
  private exameService = inject(ExameService);
  private servicoService = inject(ServicoService);
  private servicoContratadoService = inject(ServicoContratadoService);
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
    // Vale para os dois perfis: o fisioterapeuta também contrata serviços.
    this.servicoService.listar().subscribe(servicos => this.servicos = servicos);

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
      this.servicosContratados = [];
      this.responsavel.setValue(this.loginService.getUserLogin()?.login ?? null);
      return;
    }

    this.exameService.listarPorPaciente(paciente.id).subscribe(exames => this.exames = exames);
    this.prontuarioService.listarPorPaciente(paciente.id).subscribe(prontuarios => this.prontuarios = prontuarios);
    this.servicoContratadoService.listarPorPaciente(paciente.id).subscribe(contratados => this.servicosContratados = contratados);
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

  /** Serviço escolhido no subformulário, base dos controles de frequência. */
  get servicoSelecionado(): Servico | null {
    return this.servicoContratacao.value;
  }

  /** Só o diretor edita o valor contratado (regra do .cruds/paciente.yaml). */
  get podeEditarValorContratado(): boolean {
    return this.loginService.hasRole(`${PREFIXO_PERFIL_SISTEMA}DIRETOR`);
  }

  /**
   * Regra "campos de frequência conforme o serviço" (.cruds/paciente.yaml): a
   * quantidade de controles vem de `frequenciaPeriodicidade` do serviço escolhido, e o
   * tipo de cada um, da periodicidade dele. Recria o FormArray do zero a cada troca de
   * serviço — repopular acumularia controles da escolha anterior.
   */
  aoSelecionarServico(): void {
    this.frequencias.clear();

    const quantidade = this.servicoSelecionado?.frequenciaPeriodicidade ?? 0;
    for (let i = 0; i < quantidade; i++) {
      this.frequencias.push(new FormControl(null, Validators.required));
    }
  }

  /** Maior dia aceito no controle numérico: 15 na quinzena, 31 no mês. */
  get limiteFrequencia(): number {
    return this.servicoSelecionado?.periodicidade === Periodicidade.QUINZENAL ? 15 : 31;
  }

  /** Rótulo de cada controle de frequência, conforme a periodicidade do serviço. */
  rotuloFrequencia(indice: number): string {
    const ordem = indice + 1;
    return this.servicoSelecionado?.periodicidade === Periodicidade.SEMANAL
      ? `${ordem}º dia da semana`
      : `${ordem}º dia`;
  }

  /**
   * Traduz a coluna `frequencia` para leitura na tabela. Os valores chegam numa string
   * só, separados por ponto e vírgula; na periodicidade semanal são inteiros de dia da
   * semana (0 = domingo) e nas demais, dias do mês ou da quinzena.
   */
  descreverFrequencia(contratado: ServicoContratado): string {
    if (!contratado.frequencia) {
      return 'Não informada';
    }

    const valores = contratado.frequencia.split(';').filter(valor => valor !== '');

    return contratado.servico?.periodicidade === Periodicidade.SEMANAL
      ? valores.map(valor => this.diaSemanaLabels[Number(valor)] ?? valor).join(', ')
      : valores.map(valor => `Dia ${valor}`).join(', ');
  }

  /**
   * Inclui a contratação. Os N controles de frequência viram uma string só, separada
   * por ponto e vírgula, que é o que a coluna guarda.
   */
  contratar(): void {
    this.formServicoContratadoEnviado = true;

    if (!this.registroGravado() || !this.subformularioValido(this.formServicoContratado)) {
      return;
    }

    const valor = this.formServicoContratado.value;
    const contratacao = {
      paciente: this.entidade,
      servico: valor.servico,
      inicioContratacao: valor.inicioContratacao,
      valorContratado: valor.valorContratado,
      frequencia: (valor.frequencias ?? []).join(';')
    };

    console.info(`Contratar serviço ${valor.servico?.nome} para o paciente de ID #${this.entidade.id}`);
    this.servicoContratadoService.incluir(contratacao).subscribe({
      next: contratado => {
        this.servicosContratados.unshift(contratado);
        this.formServicoContratado.reset();
        this.frequencias.clear();
        this.formServicoContratadoEnviado = false;
        this.exibirMensagem.showMessage(
          `Serviço ${contratado.servico?.nome} contratado com sucesso`,
          'Contratar Serviço',
          DecoracaoMensagem.SUCESSO
        );
      }
    });
  }

  /**
   * Encerra a contratação sem abrir o registro para edição: o backend grava a data de
   * hoje no fim da contratação e devolve a contratação atualizada, que substitui a
   * linha na tabela.
   */
  encerrarContratacao(contratado: ServicoContratado): void {
    this.exibirMensagem
      .showConfirm(`Confirma o encerramento da contratação do serviço ${contratado.servico?.nome}`, "Encerrar?")
      .then(resposta => {
        if (!resposta.value) {
          return;
        }

        console.info(`Encerrar contratação de ID #${contratado.id}`);
        this.servicoContratadoService.encerrar(contratado.id).subscribe({
          next: encerrado => {
            this.servicosContratados = this.servicosContratados.map(item => item.id === encerrado.id ? encerrado : item);
            this.exibirMensagem.showMessage(
              `Contratação do serviço ${encerrado.servico?.nome} encerrada com sucesso`,
              'Encerrar Contratação',
              DecoracaoMensagem.SUCESSO
            );
          }
        });
      });
  }

  excluirServicoContratado(contratado: ServicoContratado): void {
    this.exibirMensagem
      .showConfirm(`Confirma a exclusão da contratação do serviço ${contratado.servico?.nome}`, "Excluir?")
      .then(resposta => {
        if (!resposta.value) {
          return;
        }

        console.info(`Excluir serviço contratado de ID #${contratado.id}`);
        this.servicoContratadoService.excluir(contratado.id).subscribe({
          next: () => this.servicosContratados = this.servicosContratados.filter(item => item.id !== contratado.id)
        });
      });
  }

}
