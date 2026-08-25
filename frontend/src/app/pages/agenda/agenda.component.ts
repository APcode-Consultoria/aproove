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

/** O par de radio buttons que escolhe a grade. */
export type VisualizacaoAgenda = 'semana' | 'mes';

/** Um dia da grade, com os atendimentos que caem nele. */
export interface DiaAgenda {
  data: string;
  diaDoMes: number;
  doPeriodo: boolean;
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
  ]
})
export class AgendaComponent implements OnInit {

  // Semana começa no domingo, como a grade.
  protected readonly nomesDosDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  atendimentos: AgendaAtendimento[] = [];
  semanas: DiaAgenda[][] = [];

  /** Grade escolhida no par de radio buttons. */
  visualizacao: VisualizacaoAgenda = 'mes';

  /**
   * Dia aberto a partir da grade do mês, em ISO.
   *
   * <p>Vive fora de {@link visualizacao} de propósito: os radios têm dois valores e
   * precisam continuar coerentes enquanto o dia está aberto — quando se volta dele, a
   * grade que reaparece é a mesma de antes.</p>
   */
  diaSelecionado: string | null = null;

  /** Qualquer dia dentro da semana ou do mês exibido. */
  referencia: Date = new Date();

  /** Preenchido só pelo diretor, para ver a agenda de outro fisioterapeuta. */
  responsavel = '';

  private agendaService = inject(AgendaService);
  private loginService = inject(LoginService);
  private spinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.carregar();
  }

  get isDiretor(): boolean {
    return this.loginService.hasRole(`${PREFIXO_PERFIL_SISTEMA}DIRETOR`);
  }

  /** Login mostrado no título: o digitado pelo diretor, ou o do próprio usuário. */
  get agendaDe(): string {
    return this.isDiretor && this.responsavel.trim()
      ? this.responsavel.trim()
      : this.loginService.getUserLogin()?.login ?? '';
  }

  /** Título do período exibido, conforme a grade. */
  get tituloPeriodo(): string {
    if (this.diaSelecionado) {
      return this.dataDoIso(this.diaSelecionado)
        .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (this.visualizacao === 'mes') {
      return this.referencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }

    // Semana que atravessa dois meses precisa do mês nas duas pontas, senão "30 a 5"
    // não diz nada.
    const { primeiro, ultimo } = this.limitesDoPeriodo();
    const mesmoMes = primeiro.getMonth() === ultimo.getMonth();
    const inicio = primeiro.toLocaleDateString('pt-BR', mesmoMes ? { day: 'numeric' } : { day: 'numeric', month: 'long' });
    const fim = ultimo.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    return `${inicio} a ${fim}`;
  }

  /** Rótulo dos botões de navegação, que andam de dia, semana ou mês. */
  get passoDeNavegacao(): string {
    if (this.diaSelecionado) return 'dia';
    return this.visualizacao === 'semana' ? 'semana' : 'mês';
  }

  get totalAtendimentos(): number {
    return this.atendimentos.length;
  }

  /** Troca de grade pelo par de radio buttons: fecha o dia aberto e recarrega. */
  trocarVisualizacao(): void {
    this.diaSelecionado = null;
    this.carregar();
  }

  /**
   * Abre a visualização do dia com todos os atendimentos dele.
   *
   * <p>Existe porque a célula da grade do mês não cabe a lista inteira: ela mostra um
   * resumo, e o dia é onde se vê tudo.</p>
   *
   * @param data dia clicado, em ISO.
   */
  abrirDia(data: string): void {
    this.diaSelecionado = data;
    this.carregar();
  }

  /** Volta do dia para a grade de onde ele foi aberto, já no mês/semana daquele dia. */
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
          this.montarSemanas(primeiro, ultimo);
          this.spinnerService.hide();
        },
        // O httpErrorsInterceptor já mostra o erro; aqui só o estado local.
        error: () => this.spinnerService.hide()
      });
  }

  /** Anda um passo para trás ou para a frente, na unidade da grade atual. */
  private andar(sentido: number): void {
    if (this.diaSelecionado) {
      const dia = this.dataDoIso(this.diaSelecionado);
      dia.setDate(dia.getDate() + sentido);
      this.diaSelecionado = this.iso(dia);
    }
    else if (this.visualizacao === 'semana') {
      this.referencia = new Date(this.referencia);
      this.referencia.setDate(this.referencia.getDate() + 7 * sentido);
    }
    else {
      this.referencia = new Date(this.referencia.getFullYear(), this.referencia.getMonth() + sentido, 1);
    }

    this.carregar();
  }

  /**
   * Primeiro e último dia consultados, conforme a grade.
   *
   * <p>Na semana, de domingo a sábado. No mês, do domingo da semana do dia 1 ao sábado
   * da semana do último dia, para as linhas ficarem completas. No dia, ele mesmo.</p>
   */
  private limitesDoPeriodo(): { primeiro: Date; ultimo: Date } {
    if (this.diaSelecionado) {
      return { primeiro: this.dataDoIso(this.diaSelecionado), ultimo: this.dataDoIso(this.diaSelecionado) };
    }

    if (this.visualizacao === 'semana') {
      const primeiro = new Date(this.referencia);
      primeiro.setDate(primeiro.getDate() - primeiro.getDay());

      const ultimo = new Date(primeiro);
      ultimo.setDate(ultimo.getDate() + 6);

      return { primeiro, ultimo };
    }

    const inicioMes = new Date(this.referencia.getFullYear(), this.referencia.getMonth(), 1);
    const fimMes = new Date(this.referencia.getFullYear(), this.referencia.getMonth() + 1, 0);

    const primeiro = new Date(inicioMes);
    primeiro.setDate(primeiro.getDate() - primeiro.getDay());

    const ultimo = new Date(fimMes);
    ultimo.setDate(ultimo.getDate() + (6 - ultimo.getDay()));

    return { primeiro, ultimo };
  }

  private montarSemanas(primeiro: Date, ultimo: Date): void {
    const porData = new Map<string, AgendaAtendimento[]>();
    for (const atendimento of this.atendimentos) {
      const chave = String(atendimento.data).substring(0, 10);
      porData.set(chave, [...(porData.get(chave) ?? []), atendimento]);
    }

    const hoje = this.iso(new Date());
    const mesExibido = this.referencia.getMonth();
    const semanas: DiaAgenda[][] = [];
    let semana: DiaAgenda[] = [];

    for (const data = new Date(primeiro); data <= ultimo; data.setDate(data.getDate() + 1)) {
      const chave = this.iso(data);
      semana.push({
        data: chave,
        diaDoMes: data.getDate(),
        // Só a grade do mês tem dias "de fora": na semana todos os sete pertencem ao
        // período exibido, mesmo quando ela atravessa a virada do mês.
        doPeriodo: this.visualizacao === 'mes' ? data.getMonth() === mesExibido : true,
        hoje: chave === hoje,
        atendimentos: porData.get(chave) ?? []
      });

      if (semana.length === 7) {
        semanas.push(semana);
        semana = [];
      }
    }

    // Sobra quando o período não fecha sete dias — o caso da visualização do dia.
    if (semana.length) {
      semanas.push(semana);
    }

    this.semanas = semanas;
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
