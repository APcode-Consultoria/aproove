import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { vi } from 'vitest';
import {
  DecoracaoMensagem,
  ExibirMensagemService,
  LoginService,
  UploadService,
  ViaCepService
} from '@andre.penteado/ngx-apcore';
import { CadastroComponent } from './cadastro.component';
import { PacienteService } from '../../../services/paciente.service';
import { ProntuarioService } from '../../../services/prontuario.service';
import { ExameService } from '../../../services/exame.service';
import { ServicoService } from '../../../services/servico.service';
import { ServicoContratadoService } from '../../../services/servico-contratado.service';
import { PagamentoService } from '../../../services/pagamento.service';
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
  'historiaMolestiaPregressa',
  'queixaPrincipal',
  'remedios',
  'objetivos',
  'observacao',
  'responsavel'
] satisfies Array<keyof Paciente>;

describe('CadastroComponent', () => {
  let component: CadastroComponent;

  const pacienteServiceMock = {
    listar: vi.fn(),
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

  // Alimenta o combo da aba de contratação. Sem o mock, o componente injetaria o
  // service de verdade e ele pediria o INIT_CONFIG, que não existe no TestBed.
  const servicoServiceMock = {
    listar: vi.fn()
  };

  const servicoContratadoServiceMock = {
    listarPorPaciente: vi.fn(),
    incluir: vi.fn(),
    encerrar: vi.fn(),
    excluir: vi.fn()
  };

  const pagamentoServiceMock = {
    listarPorPaciente: vi.fn(),
    alterar: vi.fn(),
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

  // `hasRole` responde pelo `podeEditarValorContratado`; `hasAnyRole`, pelas ações das
  // listas resolvidas em `perfis-crud`. Sem perfil nenhum, a tela nasce sem ações — que
  // é o cenário destes testes, focados no formulário.
  const loginServiceMock = {
    getUserLogin: vi.fn(() => null),
    hasRole: vi.fn(() => false),
    hasAnyRole: vi.fn(() => false)
  };

  /** O `form` do CRUD é protected na base; nos testes acessamos por índice. */
  function formPaciente(): FormGroup {
    return component['form'] as FormGroup;
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    // As listas independentes são recarregadas pelo aposCarregar sempre que a entidade muda.
    prontuarioServiceMock.listarPorPaciente.mockReturnValue(of([]));
    exameServiceMock.listarPorPaciente.mockReturnValue(of([]));
    servicoContratadoServiceMock.listarPorPaciente.mockReturnValue(of([]));
    pagamentoServiceMock.listarPorPaciente.mockReturnValue(of([]));
    servicoServiceMock.listar.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: PacienteService, useValue: pacienteServiceMock },
        { provide: ProntuarioService, useValue: prontuarioServiceMock },
        { provide: ExameService, useValue: exameServiceMock },
        { provide: ServicoService, useValue: servicoServiceMock },
        { provide: ServicoContratadoService, useValue: servicoContratadoServiceMock },
        { provide: PagamentoService, useValue: pagamentoServiceMock },
        { provide: ViaCepService, useValue: viaCepServiceMock },
        { provide: ExibirMensagemService, useValue: exibirMensagemServiceMock },
        { provide: UploadService, useValue: uploadServiceMock },
        { provide: LoginService, useValue: loginServiceMock }
      ]
    }).compileComponents();

    component = TestBed.runInInjectionContext(() => new CadastroComponent());
  });

  function preencherCamposObrigatorios(): void {
    formPaciente().patchValue({
      nome: 'Maria da Silva'
    });
  }

  it('deve enviar no gravar um payload com a mesma estrutura de Paciente', async () => {
    preencherCamposObrigatorios();

    const pacienteSalvo = {
      ...formPaciente().getRawValue(),
      id: 1,
      nome: 'Maria da Silva'
    } as Paciente;

    pacienteServiceMock.gravar.mockReturnValue(of(pacienteSalvo));

    await component.gravar();

    expect(pacienteServiceMock.gravar).toHaveBeenCalledTimes(1);

    const payloadEnviado = pacienteServiceMock.gravar.mock.calls[0][0] as Record<string, unknown>;
    expect(Object.keys(payloadEnviado).sort()).toEqual([...pacienteKeys].sort());
  });

  it('deve recarregar as listas independentes apos gravar', async () => {
    preencherCamposObrigatorios();
    pacienteServiceMock.gravar.mockReturnValue(of({ id: 7, nome: 'Maria da Silva' } as Paciente));

    await component.gravar();

    expect(exameServiceMock.listarPorPaciente).toHaveBeenCalledWith(7);
    expect(prontuarioServiceMock.listarPorPaciente).toHaveBeenCalledWith(7);
    expect(servicoContratadoServiceMock.listarPorPaciente).toHaveBeenCalledWith(7);
    expect(pagamentoServiceMock.listarPorPaciente).toHaveBeenCalledWith(7);
  });

  it('deve considerar o formulario invalido quando os campos obrigatorios nao forem preenchidos', async () => {
    formPaciente().patchValue({
      nome: null
    });

    await component.gravar();

    expect(formPaciente().invalid).toBe(true);
    expect(component.nome.hasError('required')).toBe(true);
    expect(pacienteServiceMock.gravar).not.toHaveBeenCalled();
    expect(exibirMensagemServiceMock.showMessage).toHaveBeenCalledWith(
      'Preencha todos os dados obrigatórios antes de gravar os dados',
      'Dados obrigatórios',
      DecoracaoMensagem.ATENCAO
    );
  });

  it('deve considerar o formulario valido quando os campos obrigatorios forem preenchidos', () => {
    preencherCamposObrigatorios();

    expect(component.nome.valid).toBe(true);
    expect(formPaciente().valid).toBe(true);
  });

  it('nao deve incluir prontuario enquanto o paciente nao estiver gravado', () => {
    component.formProntuario.patchValue({ atendimento: 'Sessão inicial' });

    component.adicionarProntuario();

    expect(prontuarioServiceMock.incluir).not.toHaveBeenCalled();
    expect(exibirMensagemServiceMock.showMessage).toHaveBeenCalledWith(
      'Grave o paciente antes de adicionar registros relacionados',
      'Registro não gravado',
      DecoracaoMensagem.ATENCAO
    );
  });
});
