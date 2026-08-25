import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { LoginService } from '@andre.penteado/ngx-apcore';
import { NgxSpinnerService } from 'ngx-spinner';
import { AgendaComponent } from './agenda.component';
import { AgendaService } from '../../services/agenda.service';
import { AgendaAtendimento } from '../../domain/entities/agenda-atendimento';

/**
 * Testes da grade de horas da agenda.
 *
 * <p>O que eles protegem é a aritmética que posiciona cada atendimento: com blocos de 5
 * minutos, errar o deslocamento da primeira hora ou o arredondamento da duração desenha
 * o atendimento na faixa errada — e a grade existe justamente para o fisioterapeuta ler
 * horário livre pelo espaço em branco. Um erro aqui não quebra a tela, mente nela.</p>
 */
describe('AgendaComponent — grade de horas', () => {

  const agendaServiceMock = { listar: vi.fn() };
  const loginServiceMock = {
    getUserLogin: vi.fn(() => ({ login: 'usuario.teste' })),
    hasRole: vi.fn(() => false)
  };
  const spinnerServiceMock = { show: vi.fn(), hide: vi.fn() };

  function atendimento(data: string, horario: string, horarioFim: string): AgendaAtendimento {
    return {
      data,
      horario,
      horarioFim,
      idPaciente: 1,
      paciente: 'Paciente de Testes',
      servico: 'Serviço de Testes',
      responsavel: 'usuario.teste'
    } as AgendaAtendimento;
  }

  /** Monta o componente numa semana conhecida: 04/05/2026 é uma segunda-feira. */
  function montar(atendimentos: AgendaAtendimento[]): AgendaComponent {
    vi.clearAllMocks();
    agendaServiceMock.listar.mockReturnValue(of(atendimentos));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: AgendaService, useValue: agendaServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        { provide: NgxSpinnerService, useValue: spinnerServiceMock }
      ]
    });

    const component = TestBed.runInInjectionContext(() => new AgendaComponent());
    component.referencia = new Date(2026, 4, 6);
    component.ngOnInit();

    return component;
  }

  function segunda(component: AgendaComponent) {
    return component.dias.find(dia => dia.data === '2026-05-04')!;
  }

  it('abre no horário da clínica: grade das 07:00 às 21:00, último rótulo 20:00', () => {
    const component = montar([]);

    // 14 rótulos: a faixa das 20:00 é a última que ainda cabe um atendimento, e a grade
    // termina na linha das 21:00 — que é fim de grade, não rótulo.
    expect(component.horas.length).toBe(14);
    expect(component.horas[0].rotulo).toBe('07:00');
    expect(component.horas[13].rotulo).toBe('20:00');
    // 14 horas × 12 blocos de 5 minutos.
    expect(component.linhasDaGrade).toBe('repeat(168, var(--agenda-bloco))');
  });

  it('rotula só a hora cheia, cada rótulo cobrindo uma hora de blocos', () => {
    const component = montar([]);

    expect(component.horas[0].gridRow).toBe('1 / span 12');
    expect(component.horas[1].gridRow).toBe('13 / span 12');
  });

  it('posiciona um atendimento de 50 minutos nos 10 blocos exatos dele', () => {
    // 50 minutos é a duração dos serviços da clínica, e é o motivo do bloco de 5: com
    // blocos de 15 esta conta não fecharia.
    const component = montar([atendimento('2026-05-04', '08:00', '08:50')]);

    // 08:00 é a segunda hora da faixa, então começa no bloco 13.
    expect(segunda(component).naGrade[0].gridRow).toBe('13 / span 10');
  });

  it('posiciona atendimento que começa na meia hora', () => {
    const component = montar([atendimento('2026-05-04', '08:30', '09:20')]);

    // 08:30 = 90 minutos após as 07:00 = bloco 19.
    expect(segunda(component).naGrade[0].gridRow).toBe('19 / span 10');
  });

  it('alarga a faixa para caber atendimento fora do horário padrão', () => {
    const component = montar([atendimento('2026-05-04', '06:00', '06:50')]);

    expect(component.horas[0].rotulo).toBe('06:00');
    expect(segunda(component).naGrade[0].gridRow).toBe('1 / span 10');
  });

  it('estica a grade até o fim do último atendimento da noite', () => {
    const component = montar([atendimento('2026-05-04', '20:30', '21:20')]);

    // 21:20 empurra o fim da grade para as 22:00, e o último rótulo passa a ser 21:00.
    expect(component.horas[component.horas.length - 1].rotulo).toBe('21:00');
  });

  it('separa os atendimentos sem horário, que não têm onde cair na grade', () => {
    const component = montar([atendimento('2026-05-04', '', '')]);

    expect(segunda(component).naGrade).toEqual([]);
    expect(segunda(component).semHorario.length).toBe(1);
    expect(component.temSemHorario).toBe(true);
  });

  it('não liga a faixa de sem horário quando todos têm hora', () => {
    const component = montar([atendimento('2026-05-04', '08:00', '08:50')]);

    expect(component.temSemHorario).toBe(false);
  });

});
