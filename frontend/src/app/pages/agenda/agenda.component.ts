/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoginService } from "@andre.penteado/ngx-apcore";
import { NgxSpinnerService } from "ngx-spinner";
import { AgendaService } from "../../services/agenda.service";
import { AgendaAtendimento } from "../../domain/entities/agenda-atendimento";
import { PREFIXO_PERFIL_SISTEMA } from "../../config/layout";

/** Um atendimento já posicionado na grade de horas. */
export interface AtendimentoNaGrade {
  atendimento: AgendaAtendimento;
  /** Valor do `grid-row`: linha inicial e quantos blocos ocupa. */
  gridRow: string;
}

/** Um dia da grade, com os atendimentos que caem nele. */
export interface DiaAgenda {
  data: string;
  diaDoMes: number;
  /** Abreviação do dia da semana, já resolvida aqui para o template não recalcular. */
  nomeDoDia: string;
  hoje: boolean;
  atendimentos: AgendaAtendimento[];
  /** Os que têm horário, posicionados na grade. */
  naGrade: AtendimentoNaGrade[];
  /** Os que não têm horário, exibidos numa faixa própria acima da grade. */
  semHorario: AgendaAtendimento[];
}

/** Um rótulo da coluna de horas. */
export interface RotuloHora {
  rotulo: string;
  gridRow: string;
}

@Component({
  selector: 'roove-agenda',
  templateUrl: './agenda.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  /**
   * A grade é a única parte da tela que o Bootstrap não resolve: oito colunas — a das
   * horas e as sete dos dias — não existem numa malha de doze, e `flex-fill` dimensiona
   * pelo conteúdo, que foi o que desalinhava as colunas quando um dia tinha mais
   * atendimentos que os outros. Com `minmax(0, 1fr)` as sete trilhas de dia têm largura
   * idêntica e independem do conteúdo, e o `min-width: 0` libera o `text-truncate`.
   *
   * <p>Cabeçalho, faixa de "sem horário" e grade são linhas do <b>mesmo</b> grid, e não
   * grids irmãos: é o que garante que o nome do dia fique sobre a coluna dele, sem
   * depender de os conteúdos terem a mesma largura.</p>
   *
   * <p>As linhas de hora são um `repeating-linear-gradient`, não elementos: são 13 traços
   * por coluna, sete colunas, e desenhá-los como div custaria 91 nós de DOM para o que o
   * fundo resolve sem nenhum.</p>
   */
  styles: `
    .agenda-rolagem {
      overflow-x: auto;
    }

    .agenda-semana {
      --agenda-altura-hora: 3.5rem;
      --agenda-bloco: calc(var(--agenda-altura-hora) / 12);

      display: grid;
      /* A coluna de horas tem a largura do rótulo; as sete de dia dividem o resto. */
      grid-template-columns: auto repeat(7, minmax(0, 1fr));
      /* Abaixo disso as colunas ficam estreitas demais para um nome: passa a rolar. */
      min-width: 46rem;
    }

    .agenda-semana > * {
      min-width: 0;
    }

    .agenda-coluna {
      display: grid;
      background-image: repeating-linear-gradient(
        to bottom,
        var(--bs-border-color) 0 1px,
        transparent 1px var(--agenda-altura-hora)
      );
    }

    .agenda-horas {
      display: grid;
    }

    /* O rótulo encosta na linha da hora a que pertence, e não no meio da faixa. */
    .agenda-hora {
      transform: translateY(-0.5em);
    }

    .agenda-atendimento {
      overflow: hidden;
      /* Um respiro entre blocos vizinhos, para dois atendimentos seguidos não colarem. */
      margin: 0 2px 1px 2px;
    }
  `
})
export class AgendaComponent implements OnInit {

  // Semana começa no domingo, como a grade.
  private readonly nomesDosDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /**
   * Altura de um bloco da grade, em minutos.
   *
   * <p>Cinco, e não quinze: os serviços da clínica duram 50 minutos, que não é múltiplo
   * de 15. Com blocos de 15 um atendimento de 50 minutos ocuparia 3,33 blocos e teria
   * que ser arredondado — a grade passaria a mentir a duração. Cinco divide 50, 45, 30 e
   * a hora cheia sem sobra.</p>
   *
   * <p>O rótulo continua só na hora cheia: o bloco é a régua, não a legenda.</p>
   */
  private readonly MINUTOS_POR_BLOCO = 5;

  private readonly BLOCOS_POR_HORA = 60 / this.MINUTOS_POR_BLOCO;

  /**
   * Faixa exibida quando nada a empurra: o horário de funcionamento da clínica.
   *
   * <p>Existe para a semana vazia continuar mostrando os horários livres, que é o ponto
   * da grade: sem atendimento nenhum não haveria de onde derivar as horas.</p>
   *
   * <p>A última hora é o <b>fim</b> da grade, não o último rótulo: com 21 a grade termina
   * às 21:00 e o último rótulo é 20:00, porque a faixa das 20:00 é a última que ainda
   * cabe um atendimento.</p>
   */
  private readonly PRIMEIRA_HORA_PADRAO = 7;

  private readonly ULTIMA_HORA_PADRAO = 21;

  atendimentos: AgendaAtendimento[] = [];

  /** Os sete dias exibidos, de domingo a sábado. */
  dias: DiaAgenda[] = [];

  /** Rótulos da coluna de horas, um por hora cheia da faixa exibida. */
  horas: RotuloHora[] = [];

  /** `grid-template-rows` da grade, com um bloco por {@link MINUTOS_POR_BLOCO} minutos. */
  linhasDaGrade = '';

  /** Verdadeiro quando algum dia da semana tem atendimento sem horário. */
  temSemHorario = false;

  /** Qualquer dia dentro da semana exibida. */
  referencia: Date = new Date();

  /**
   * Dia aberto a partir da grade da semana, em ISO.
   *
   * <p>A célula da semana corta os nomes longos para as sete colunas caberem; o dia é
   * onde eles aparecem inteiros. Enquanto está preenchido, a consulta e a navegação
   * passam a ser de um dia só.</p>
   */
  diaSelecionado: string | null = null;

  /**
   * Login de quem se está consultando.
   *
   * <p>Nasce com o do usuário logado, para a tela abrir já na agenda de quem entrou. Só
   * o diretor troca o valor; para os demais o backend força o próprio login.</p>
   */
  responsavel = '';

  private agendaService = inject(AgendaService);
  private loginService = inject(LoginService);
  private spinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.responsavel = this.loginService.getUserLogin()?.login ?? '';
    this.carregar();
  }

  get isDiretor(): boolean {
    return this.loginService.hasRole(`${PREFIXO_PERFIL_SISTEMA}DIRETOR`);
  }

  /** Login mostrado no título: o digitado pelo diretor, ou o do próprio usuário. */
  get agendaDe(): string {
    return this.responsavel.trim() || (this.loginService.getUserLogin()?.login ?? '');
  }

  /** Título do período exibido: o dia aberto, ou a semana. */
  get tituloPeriodo(): string {
    if (this.diaSelecionado) {
      return this.dataDoIso(this.diaSelecionado)
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Semana que atravessa dois meses precisa do mês nas duas pontas, senão "30 a 5"
    // não diz nada.
    const { primeiro, ultimo } = this.limitesDoPeriodo();
    const mesmoMes = primeiro.getMonth() === ultimo.getMonth();
    const inicio = primeiro.toLocaleDateString('pt-BR', mesmoMes ? { day: 'numeric' } : { day: 'numeric', month: 'long' });
    const fim = ultimo.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    return `${inicio} a ${fim}`;
  }

  get totalAtendimentos(): number {
    return this.atendimentos.length;
  }

  /** Rótulo dos botões de navegação, que andam de dia ou de semana. */
  get passoDeNavegacao(): string {
    return this.diaSelecionado ? 'dia' : 'semana';
  }

  /**
   * Abre a visualização do dia, com os atendimentos dele por inteiro.
   *
   * @param data dia clicado, em ISO.
   */
  abrirDia(data: string): void {
    this.diaSelecionado = data;
    this.carregar();
  }

  /** Volta do dia para a semana em que ele cai. */
  fecharDia(): void {
    if (this.diaSelecionado) {
      this.referencia = this.dataDoIso(this.diaSelecionado);
    }

    this.diaSelecionado = null;
    this.carregar();
  }

  anterior(): void {
    this.andar(-1);
  }

  seguinte(): void {
    this.andar(1);
  }

  irParaHoje(): void {
    this.diaSelecionado = null;
    this.referencia = new Date();
    this.carregar();
  }

  /** Recarrega ao trocar o fisioterapeuta consultado. */
  aplicarResponsavel(): void {
    this.carregar();
  }

  /** Faixa "início – fim" do atendimento, ou só o início quando não há duração. */
  faixaDeHorario(atendimento: AgendaAtendimento): string {
    if (!atendimento.horario) {
      return 'Sem horário';
    }

    return `${atendimento.horario.substring(0, 5)} – ${atendimento.horarioFim.substring(0, 5)}`;
  }

  carregar(): void {
    const { primeiro, ultimo } = this.limitesDoPeriodo();

    this.spinnerService.show();
    console.info(`Consultar agenda de ${this.agendaDe} entre ${this.iso(primeiro)} e ${this.iso(ultimo)}`);

    this.agendaService.listar(this.iso(primeiro), this.iso(ultimo), this.isDiretor ? this.responsavel : undefined)
      .subscribe({
        next: atendimentos => {
          this.atendimentos = atendimentos;
          // A tela do dia lê `atendimentos` direto: a grade só existe na semana.
          this.dias = this.diaSelecionado ? [] : this.montarDias(primeiro, ultimo);
          this.spinnerService.hide();
        },
        // O httpErrorsInterceptor já mostra o erro; aqui só o estado local.
        error: () => this.spinnerService.hide()
      });
  }

  /** Anda um passo para trás ou para a frente, na unidade da tela atual. */
  private andar(sentido: number): void {
    if (this.diaSelecionado) {
      const dia = this.dataDoIso(this.diaSelecionado);
      dia.setDate(dia.getDate() + sentido);
      this.diaSelecionado = this.iso(dia);
    }
    else {
      this.referencia = new Date(this.referencia);
      this.referencia.setDate(this.referencia.getDate() + 7 * sentido);
    }

    this.carregar();
  }

  /** Dia aberto, ou domingo e sábado da semana em que cai a {@link referencia}. */
  private limitesDoPeriodo(): { primeiro: Date; ultimo: Date } {
    if (this.diaSelecionado) {
      const dia = this.dataDoIso(this.diaSelecionado);
      return { primeiro: dia, ultimo: dia };
    }

    const primeiro = new Date(this.referencia);
    primeiro.setDate(primeiro.getDate() - primeiro.getDay());

    const ultimo = new Date(primeiro);
    ultimo.setDate(ultimo.getDate() + 6);

    return { primeiro, ultimo };
  }

  private montarDias(primeiro: Date, ultimo: Date): DiaAgenda[] {
    const porData = new Map<string, AgendaAtendimento[]>();
    for (const atendimento of this.atendimentos) {
      const chave = String(atendimento.data).substring(0, 10);
      porData.set(chave, [...(porData.get(chave) ?? []), atendimento]);
    }

    const { primeiraHora, ultimaHora } = this.faixaDeHoras();
    this.montarColunaDeHoras(primeiraHora, ultimaHora);

    const hoje = this.iso(new Date());
    const dias: DiaAgenda[] = [];

    for (const data = new Date(primeiro); data <= ultimo; data.setDate(data.getDate() + 1)) {
      const chave = this.iso(data);
      const doDia = porData.get(chave) ?? [];

      dias.push({
        data: chave,
        diaDoMes: data.getDate(),
        nomeDoDia: this.nomesDosDias[data.getDay()] ?? '',
        hoje: chave === hoje,
        atendimentos: doDia,
        naGrade: doDia.filter(atendimento => !!atendimento.horario)
          .map(atendimento => this.posicionar(atendimento, primeiraHora)),
        semHorario: doDia.filter(atendimento => !atendimento.horario)
      });
    }

    this.temSemHorario = dias.some(dia => dia.semHorario.length > 0);

    return dias;
  }

  /**
   * Primeira e última hora cheia exibidas.
   *
   * <p>Parte da faixa padrão e a alarga para caber o que existe na semana — nunca
   * encolhe: a grade serve tanto para ver o que está marcado quanto para enxergar o que
   * está livre, e cortar as horas vazias tiraria metade da utilidade.</p>
   */
  private faixaDeHoras(): { primeiraHora: number; ultimaHora: number } {
    let primeiraHora = this.PRIMEIRA_HORA_PADRAO;
    let ultimaHora = this.ULTIMA_HORA_PADRAO;

    for (const atendimento of this.atendimentos) {
      if (!atendimento.horario) {
        continue;
      }

      primeiraHora = Math.min(primeiraHora, Math.floor(this.minutosDoHorario(atendimento.horario) / 60));
      ultimaHora = Math.max(ultimaHora, Math.ceil(this.minutosDoHorario(atendimento.horarioFim) / 60));
    }

    // A grade acaba na virada do dia, mesmo que a soma da duração tenha passado dela.
    return { primeiraHora, ultimaHora: Math.min(ultimaHora, 24) };
  }

  private montarColunaDeHoras(primeiraHora: number, ultimaHora: number): void {
    const horas: RotuloHora[] = [];

    for (let hora = primeiraHora; hora < ultimaHora; hora++) {
      const linha = (hora - primeiraHora) * this.BLOCOS_POR_HORA + 1;
      horas.push({
        rotulo: `${String(hora).padStart(2, '0')}:00`,
        gridRow: `${linha} / span ${this.BLOCOS_POR_HORA}`
      });
    }

    this.horas = horas;
    this.linhasDaGrade = `repeat(${horas.length * this.BLOCOS_POR_HORA}, var(--agenda-bloco))`;
  }

  /**
   * Coloca um atendimento na grade, do bloco em que começa ao em que termina.
   *
   * <p>Não há caminho para atendimento sem término: a duração do serviço é obrigatória,
   * e o backend só deixa o horário final nulo quando o inicial também é — caso que já
   * saiu daqui para a faixa de "sem hora". O `Math.max` cobre a única sobra possível,
   * a soma da duração atravessando a meia-noite.</p>
   */
  private posicionar(atendimento: AgendaAtendimento, primeiraHora: number): AtendimentoNaGrade {
    const deslocamento = primeiraHora * 60;
    const inicio = this.minutosDoHorario(atendimento.horario) - deslocamento;
    const fim = this.minutosDoHorario(atendimento.horarioFim) - deslocamento;
    const blocos = Math.ceil((fim - inicio) / this.MINUTOS_POR_BLOCO);

    return {
      atendimento,
      gridRow: `${Math.floor(inicio / this.MINUTOS_POR_BLOCO) + 1} / span ${Math.max(blocos, 1)}`
    };
  }

  /** Converte 'HH:mm' ou 'HH:mm:ss' em minutos desde a meia-noite. */
  private minutosDoHorario(horario: string): number {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora * 60 + (minuto ?? 0);
  }

  /** Data em ISO local — `toISOString()` converteria para UTC e poderia virar o dia. */
  private iso(data: Date): string {
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${data.getFullYear()}-${mes}-${dia}`;
  }

  /** Inverso do {@link iso} — `new Date('2026-09-15')` leria a data em UTC. */
  private dataDoIso(valor: string): Date {
    const [ano, mes, dia] = valor.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }

}
