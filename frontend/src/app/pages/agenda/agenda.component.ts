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

/** Um dia da grade, com os atendimentos que caem nele. */
export interface DiaAgenda {
  data: string;
  diaDoMes: number;
  /** Abreviação do dia da semana, já resolvida aqui para o template não recalcular. */
  nomeDoDia: string;
  hoje: boolean;
  atendimentos: AgendaAtendimento[];
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
   * A grade é a única parte da tela que o Bootstrap não resolve: sete colunas iguais não
   * existem numa malha de doze, e `flex-fill` dimensiona pelo conteúdo — foi o que
   * desalinhava as colunas quando um dia tinha mais atendimentos que os outros. Com
   * `minmax(0, 1fr)` as sete trilhas têm largura fixa e independem do conteúdo, e o
   * `min-width: 0` das células libera o `text-truncate` dos nomes longos.
   */
  styles: `
    .agenda-semana {
      display: grid;
      grid-template-columns: 1fr;
    }

    .agenda-dia {
      min-width: 0;
    }

    @media (min-width: 768px) {
      .agenda-semana {
        grid-template-columns: repeat(7, minmax(0, 1fr));
      }

      /* Altura mínima só na grade: empilhado no celular ela viraria uma sequência de
         blocos vazios altos, e o dia sem atendimento não precisa de mais que o cabeçalho. */
      .agenda-dia {
        min-height: 11rem;
      }
    }
  `
})
export class AgendaComponent implements OnInit {

  // Semana começa no domingo, como a grade.
  private readonly nomesDosDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  atendimentos: AgendaAtendimento[] = [];

  /** Os sete dias exibidos, de domingo a sábado. */
  dias: DiaAgenda[] = [];

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

    const inicio = atendimento.horario.substring(0, 5);
    return atendimento.horarioFim
      ? `${inicio} – ${atendimento.horarioFim.substring(0, 5)}`
      : inicio;
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

    const hoje = this.iso(new Date());
    const dias: DiaAgenda[] = [];

    for (const data = new Date(primeiro); data <= ultimo; data.setDate(data.getDate() + 1)) {
      const chave = this.iso(data);
      dias.push({
        data: chave,
        diaDoMes: data.getDate(),
        nomeDoDia: this.nomesDosDias[data.getDay()] ?? '',
        hoje: chave === hoje,
        atendimentos: porData.get(chave) ?? []
      });
    }

    return dias;
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
