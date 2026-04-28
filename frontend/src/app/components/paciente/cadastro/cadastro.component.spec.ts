import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import {
  DecoracaoMensagem,
  ExibirMensagemService,
  UploadService,
  ViaCepService
} from '@andre.penteado/ngx-apcore';
import { CadastroComponent } from './cadastro.component';
import { PacienteService } from '../../../services/paciente.service';
import { ProntuarioService } from '../../../services/prontuario.service';
import { ExameService } from '../../../services/exame.service';
import { Paciente } from '../../../domain/entities/paciente';

const pacienteKeys = [
  'id',
  'dataCadastro',
  'dataUltimaAtualizacao',
  'usuarioCadastro',
  'usuarioUltimaAtualizacao',
  'nome',
  'cpf',
  'dataNascimento',
  'telefone',
  'whatsapp',
  'email',
  'contatoEmergencia',
  'parentescoContatoEmergencia',
  'cep',
  'logradouro',
  'complemento',
  'numeroLogradouro',
  'bairro',
  'cidade',
  'estado',
  'profissao',
  'diaVencimento',
  'frequenciaSemanal',
  'historiaMolestiaPregressa',
  'queixaPrincipal',
  'remedios',
  'objetivos',
  'responsavel'
] satisfies Array<keyof Paciente>;

describe('CadastroComponent', () => {
  let component: CadastroComponent;

  const pacienteServiceMock = {
    gravar: vi.fn(),
    buscar: vi.fn()
  };

  const prontuarioServiceMock = {
    listarPorPaciente: vi.fn(),
    incluir: vi.fn(),
    excluir: vi.fn()
  };

  const exameServiceMock = {
    listarPorPaciente: vi.fn(),
    incluir: vi.fn(),
    excluir: vi.fn()
  };

  const viaCepServiceMock = {
    consultarCep: vi.fn()
  };

  const exibirMensagemServiceMock = {
    showMessage: vi.fn(),
    showConfirm: vi.fn()
  };

  const uploadServiceMock = {
    buscar: vi.fn(),
    incluir: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: PacienteService, useValue: pacienteServiceMock },
        { provide: ProntuarioService, useValue: prontuarioServiceMock },
        { provide: ExameService, useValue: exameServiceMock },
        { provide: ViaCepService, useValue: viaCepServiceMock },
        { provide: ExibirMensagemService, useValue: exibirMensagemServiceMock },
        { provide: UploadService, useValue: uploadServiceMock }
      ]
    }).compileComponents();

    component = TestBed.runInInjectionContext(() => new CadastroComponent());
  });

  function preencherCamposObrigatorios(): void {
    component.formPaciente.patchValue({
      nome: 'Maria da Silva',
      cpf: 12345678901,
      telefone: 11999999999,
      queixaPrincipal: 'Dor lombar',
      historiaMolestiaPregressa: 'Sem historico relevante'
    });
  }

  it('deve enviar no gravarPaciente um payload com a mesma estrutura de Paciente', () => {
    preencherCamposObrigatorios();

    const pacienteSalvo = {
      ...component.formPaciente.getRawValue(),
      id: 1,
      nome: 'Maria da Silva'
    } as Paciente;

    pacienteServiceMock.gravar.mockReturnValue(of(pacienteSalvo));

    component.gravarPaciente();

    expect(pacienteServiceMock.gravar).toHaveBeenCalledTimes(1);

    const payloadEnviado = pacienteServiceMock.gravar.mock.calls[0][0] as Record<string, unknown>;
    expect(Object.keys(payloadEnviado).sort()).toEqual([...pacienteKeys].sort());
  });

  it('deve considerar o formPaciente invalido quando os campos obrigatorios nao forem preenchidos', () => {
    component.formPaciente.patchValue({
      nome: null,
      cpf: null,
      telefone: null,
      queixaPrincipal: null,
      historiaMolestiaPregressa: null
    });

    component.gravarPaciente();

    expect(component.formPaciente.invalid).toBe(true);
    expect(component.nome.hasError('required')).toBe(true);
    expect(component.cpf.hasError('required')).toBe(true);
    expect(component.telefone.hasError('required')).toBe(true);
    expect(component.queixaPrincipal.hasError('required')).toBe(true);
    expect(component.historiaMolestiaPregressa.hasError('required')).toBe(true);
    expect(pacienteServiceMock.gravar).not.toHaveBeenCalled();
    expect(exibirMensagemServiceMock.showMessage).toHaveBeenCalledWith(
      'Preencha todos os dados obrigatórios antes de gravar os dados',
      'Dados Obrigatórios',
      DecoracaoMensagem.PRIMARIO
    );
  });

  it('deve considerar o formPaciente valido quando os campos obrigatorios forem preenchidos', () => {
    preencherCamposObrigatorios();

    expect(component.nome.valid).toBe(true);
    expect(component.cpf.valid).toBe(true);
    expect(component.telefone.valid).toBe(true);
    expect(component.queixaPrincipal.valid).toBe(true);
    expect(component.historiaMolestiaPregressa.valid).toBe(true);
    expect(component.formPaciente.valid).toBe(true);
  });
});
