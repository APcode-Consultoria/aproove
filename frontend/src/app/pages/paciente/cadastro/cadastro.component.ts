import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { ProntuarioService } from '../../../services/prontuario.service';
import { ExameService } from '../../../services/exame.service';
import { ServicoService } from '../../../services/servico.service';
import { ServicoContratadoService } from '../../../services/servico-contratado.service';
import { PagamentoService } from '../../../services/pagamento.service';
import {
  CadastroBaseComponent,
  CampoDataComponent,
  CampoMoedaComponent,
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
import { Pagamento } from "../../../domain/entities/pagamento";
import { Periodicidade } from "../../../domain/enums/periodicidade";
import { DiaSemana, DIAS_SEMANA, DIA_SEMANA_LABELS } from "../../../domain/enums/dia-semana";
import { ConfigCrud, resolverPerfil } from "../../../config/perfis-crud";
import { ACOES_LISTAS_PACIENTE } from "../paciente.perfis";
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
    NgxMaskDirective,
    CampoMoedaComponent,
    CampoDataComponent
  ]
})
export class CadastroComponent extends CadastroBaseComponent<Paciente> {

  protected readonly PREFIXO_PERFIL_SISTEMA = PREFIXO_PERFIL_SISTEMA;

  protected readonly mascaraCpf = MASCARA_CPF;
  protected readonly mascaraTelefone = MASCARA_TELEFONE;
  protected readonly mascaraCep = MASCARA_CEP;

  protected readonly Periodicidade = Periodicidade;
  protected readonly diasSemana = DIAS_SEMANA;
  protected readonly diaSemanaLabels = DIA_SEMANA_LABELS;

  // Estado de envio dos subformulários das listas. O do formulário do paciente é o
  // `formEnviado` herdado da base.
  formProntuarioEnviado = false;
  formExamesEnviado = false;
  formServicoContratadoEnviado = false;
  formPagamentoEnviado = false;

  parentescos: string[];
  enumParentescos = Parentesco;

  // Listas `persistencia: independente`: arrays comuns, não FormArray. Cada item já
  // foi persistido pelo service do filho.
  prontuarios: Prontuario[] = [];
  exames: Exame[] = [];
  servicosContratados: ServicoContratado[] = [];
  pagamentos: Pagamento[] = [];
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
  // `frequencia` do serviço e só é conhecida depois da escolha, por isso FormArray. O
  // tipo de cada controle depende da periodicidade: data no AVULSO, combo de dia da
  // semana no SEMANAL e numérico de 1 a 31 no MENSAL.
  frequencias = new FormArray<FormControl<any>>([]);
  // Paralelo ao de frequências, uma posição para cada ocorrência: guarda o horário
  // inicial do atendimento. Os dois viram colunas separadas por ponto e vírgula, na
  // mesma ordem.
  horarios = new FormArray<FormControl<any>>([]);
  formServicoContratado = new FormGroup({
    servico: this.servicoContratacao,
    inicioContratacao: this.inicioContratacao,
    valorContratado: this.valorContratado,
    frequencias: this.frequencias,
    horarios: this.horarios
  });

  // Fim derivado das datas escolhidas numa contratação avulsa, só para exibição: quem
  // grava o campo é o ServicoContratadoService.
  fimContratacaoAvulsa: string | null = null;

  // Subformulário da ação Pagar. Só data e valor pagos: contratação, vencimento e valor
  // vêm da contratação e o backend os repõe. `pagamentoEmPagamento` guarda qual linha
  // está carregada — a aba não tem botão de adicionar, o registro já existe.
  pagamentoEmPagamento: Pagamento | null = null;
  dataPagamento = new FormControl(null, Validators.required);
  valorPago = new FormControl(null, Validators.required);
  formPagamento = new FormGroup({
    dataPagamento: this.dataPagamento,
    valorPago: this.valorPago
  });

  protected loginService = inject(LoginService);

  // `lista.acoes` de servicos_contratados e de pagamentos varia por perfil (só o diretor
  // exclui), então essas duas listas ganham a configuração resolvida na construção do
  // componente. O resto da tela não varia por perfil e não passa por aqui.
  protected readonly config: ConfigCrud = resolverPerfil(ACOES_LISTAS_PACIENTE, this.loginService);

  private pacienteService = inject(PacienteService);
  private prontuarioService = inject(ProntuarioService);
  private exameService = inject(ExameService);
  private servicoService = inject(ServicoService);
  private servicoContratadoService = inject(ServicoContratadoService);
  private pagamentoService = inject(PagamentoService);
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
      this.pagamentos = [];
      this.responsavel.setValue(this.loginService.getUserLogin()?.login ?? null);
      return;
    }

    this.exameService.listarPorPaciente(paciente.id).subscribe(exames => this.exames = exames);
    this.prontuarioService.listarPorPaciente(paciente.id).subscribe(prontuarios => this.prontuarios = prontuarios);
    this.servicoContratadoService.listarPorPaciente(paciente.id).subscribe(contratados => this.servicosContratados = contratados);
    this.pagamentoService.listarPorPaciente(paciente.id).subscribe(pagamentos => this.pagamentos = pagamentos);
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

  /** Controles de horário, para o template parear cada um com o dia da mesma posição. */
  get horariosControles(): FormControl<any>[] {
    return this.horarios.controls as FormControl<any>[];
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
   * quantidade de controles vem de `frequencia` do serviço escolhido, e o tipo de cada
   * um, da periodicidade dele. Recria o FormArray do zero a cada troca de serviço —
   * repopular acumularia controles da escolha anterior.
   */
  aoSelecionarServico(): void {
    this.frequencias.clear();
    this.horarios.clear();
    this.fimContratacaoAvulsa = null;

    // O valor da contratação nasce do valor cadastrado no serviço. Vale mesmo para quem
    // não é diretor, que vê o campo somente leitura: o service repõe o valor no
    // backend, mas a tela precisa mostrar quanto vai ser cobrado antes de contratar.
    this.valorContratado.setValue((this.servicoSelecionado?.valor ?? null) as any);

    // No avulso o início sai das datas escolhidas; limpar evita carregar para a nova
    // escolha o que foi digitado para a anterior.
    if (this.contratacaoAvulsa) {
      this.inicioContratacao.setValue(null);
    }

    const quantidade = this.servicoSelecionado?.frequencia ?? 0;
    for (let i = 0; i < quantidade; i++) {
      this.frequencias.push(new FormControl(null, Validators.required));
      this.horarios.push(new FormControl(null, Validators.required));
    }
  }

  /** O serviço escolhido é avulso, e portanto tem período fechado. */
  get contratacaoAvulsa(): boolean {
    return this.servicoSelecionado?.periodicidade === Periodicidade.AVULSO;
  }

  /**
   * Regra "contratação avulsa nasce fechada" (.cruds/paciente.yaml): sem recorrência, o
   * período da contratação é o intervalo das datas escolhidas. Roda a cada data
   * alterada, para o período aparecer antes de gravar — mas quem decide é o
   * ServicoContratadoService, que refaz a conta ao receber o payload.
   */
  aoAlterarDataAvulsa(): void {
    if (!this.contratacaoAvulsa) {
      return;
    }

    // ISO ordena igual a cronológico, então basta ordenar como texto.
    const datas = (this.frequencias.value as (string | null)[])
      .filter((data): data is string => !!data)
      .sort();

    this.inicioContratacao.setValue(datas.length ? datas[0] : null);
    this.fimContratacaoAvulsa = datas.length ? datas[datas.length - 1] : null;
  }

  /** Resumo do cabeçalho dos controles de frequência, conforme a periodicidade. */
  get resumoFrequencia(): string {
    const quantidade = this.servicoSelecionado?.frequencia ?? 0;

    switch (this.servicoSelecionado?.periodicidade) {
      case Periodicidade.AVULSO:
        // Avulso nao se repete: cada controle e uma data especifica, e nao um ritmo.
        return `${quantidade} ${quantidade === 1 ? 'data' : 'datas'}, sem recorrência`;
      case Periodicidade.SEMANAL:
        return `${quantidade}x por semana`;
      case Periodicidade.MENSAL:
        return `${quantidade}x por mês`;
      default:
        return `${quantidade}x por período`;
    }
  }

  /** Rótulo de cada controle de frequência, conforme a periodicidade do serviço. */
  rotuloFrequencia(indice: number): string {
    const ordem = indice + 1;

    switch (this.servicoSelecionado?.periodicidade) {
      case Periodicidade.AVULSO:
        return `${ordem}ª data`;
      case Periodicidade.SEMANAL:
        return `${ordem}º dia da semana`;
      default:
        return `${ordem}º dia do mês`;
    }
  }

  /**
   * Traduz a coluna `frequencia` para leitura na tabela. Os valores chegam numa string
   * só, separados por ponto e vírgula, e o significado de cada um vem da periodicidade
   * do serviço: data no AVULSO, nome de dia da semana no SEMANAL e dia do mês no
   * MENSAL. O horário da mesma posição acompanha o valor.
   */
  descreverFrequencia(contratado: ServicoContratado): string {
    if (!contratado.frequencia) {
      return 'Não informada';
    }

    const valores = contratado.frequencia.split(';').filter(valor => valor !== '');
    const horarios = (contratado.horarios ?? '').split(';');

    return valores
      .map((valor, indice) => {
        const quando = this.descreverValorFrequencia(contratado.servico?.periodicidade, valor);
        const horario = horarios[indice];
        return horario ? `${quando} às ${horario}` : quando;
      })
      .join(', ');
  }

  /** Um valor da coluna `frequencia` em texto, conforme a periodicidade. */
  private descreverValorFrequencia(periodicidade: Periodicidade | undefined, valor: string): string {
    if (periodicidade === Periodicidade.AVULSO) {
      return this.formatarDataIso(valor);
    }

    if (periodicidade === Periodicidade.SEMANAL) {
      return this.diaSemanaLabels[valor as DiaSemana] ?? valor;
    }

    return `Dia ${valor}`;
  }

  /**
   * Data ISO da coluna em dd/mm/aaaa. Feito na mão, e não com `new Date()`: o
   * construtor leria '2026-09-15' como UTC e o fuso local poderia voltar um dia.
   */
  private formatarDataIso(valor: string): string {
    const partes = valor.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : valor;
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
      frequencia: (valor.frequencias ?? []).join(';'),
      horarios: (valor.horarios ?? []).join(';')
    };

    console.info(`Contratar serviço ${valor.servico?.nome} para o paciente de ID #${this.entidade.id}`);
    this.servicoContratadoService.incluir(contratacao).subscribe({
      next: contratado => {
        this.servicosContratados.unshift(contratado);
        // A contratação gera o primeiro pagamento no backend (regra "pagamento gerado
        // ao contratar"): a aba de pagamentos precisa recarregar para mostrá-lo.
        this.recarregarPagamentos();
        this.formServicoContratado.reset();
        this.frequencias.clear();
        this.horarios.clear();
        this.fimContratacaoAvulsa = null;
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

  /** Recarrega a aba de pagamentos a partir do backend, que é quem cria os registros. */
  private recarregarPagamentos(): void {
    if (!this.entidade?.id) {
      this.pagamentos = [];
      return;
    }

    this.pagamentoService.listarPorPaciente(this.entidade.id).subscribe(pagamentos => this.pagamentos = pagamentos);
  }

  /** Carrega a linha no formulário da ação Pagar. Linha já paga não oferece a ação. */
  iniciarPagamento(pagamento: Pagamento): void {
    this.pagamentoEmPagamento = pagamento;
    this.formPagamentoEnviado = false;
    this.formPagamento.reset();
    // Sugere a data de hoje e o valor cobrado; o usuário ajusta se pagou diferente.
    this.dataPagamento.setValue(new Date().toISOString().substring(0, 10) as any);
    this.valorPago.setValue(pagamento.valor as any);
  }

  cancelarPagamento(): void {
    this.pagamentoEmPagamento = null;
    this.formPagamentoEnviado = false;
    this.formPagamento.reset();
  }

  /**
   * Confirma o pagamento da linha carregada. O backend repõe contratação, vencimento e
   * valor, e — pela regra "renovação ao pagar" — gera o próximo pagamento quando a
   * contratação está em aberto; por isso a aba recarrega em vez de trocar só a linha.
   */
  pagar(): void {
    this.formPagamentoEnviado = true;

    if (!this.pagamentoEmPagamento || !this.subformularioValido(this.formPagamento)) {
      return;
    }

    const pagamento = {
      ...this.pagamentoEmPagamento,
      dataPagamento: this.formPagamento.value.dataPagamento,
      valorPago: this.formPagamento.value.valorPago
    };

    console.info(`Pagar pagamento de ID #${this.pagamentoEmPagamento.id}`);
    this.pagamentoService.alterar(pagamento, this.pagamentoEmPagamento.id).subscribe({
      next: pago => {
        this.cancelarPagamento();
        this.recarregarPagamentos();
        this.exibirMensagem.showMessage(
          `Pagamento de ${pago.servicoContratado?.servico?.nome} registrado com sucesso`,
          'Pagar',
          DecoracaoMensagem.SUCESSO
        );
      }
    });
  }

  excluirPagamento(pagamento: Pagamento): void {
    this.exibirMensagem
      .showConfirm(`Confirma a exclusão do pagamento com vencimento em ${pagamento.dataVencimento}`, "Excluir?")
      .then(resposta => {
        if (!resposta.value) {
          return;
        }

        console.info(`Excluir pagamento de ID #${pagamento.id}`);
        this.pagamentoService.excluir(pagamento.id).subscribe({
          next: () => this.pagamentos = this.pagamentos.filter(item => item.id !== pagamento.id)
        });
      });
  }

}
