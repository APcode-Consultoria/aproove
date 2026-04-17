import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PacienteService } from './paciente.service';
import { INIT_CONFIG } from '../config/init-config.token';
import { Paciente } from '../domain/entities/paciente';

const BASE_URL = 'http://localhost:8080';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: INIT_CONFIG, useValue: { urlBackend: BASE_URL } },
      ],
    });
    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listar()', () => {
    it('deve fazer GET em /pacientes e retornar lista', () => {
      const mockPacientes: Partial<Paciente>[] = [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Souza' },
      ];

      service.listar().subscribe(pacientes => {
        expect(pacientes.length).toBe(2);
        expect(pacientes[0].nome).toBe('João Silva');
        expect(pacientes[1].nome).toBe('Maria Souza');
      });

      const req = httpMock.expectOne(`${BASE_URL}/pacientes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPacientes);
    });

    it('deve retornar lista vazia quando não há pacientes', () => {
      service.listar().subscribe(pacientes => {
        expect(pacientes.length).toBe(0);
      });

      const req = httpMock.expectOne(`${BASE_URL}/pacientes`);
      req.flush([]);
    });
  });

  describe('buscar()', () => {
    it('deve fazer GET em /pacientes/:id e retornar o paciente', () => {
      const mockPaciente: Partial<Paciente> = { id: 1, nome: 'João Silva', cpf: 12345678901 };

      service.buscar(1).subscribe(paciente => {
        expect(paciente.id).toBe(1);
        expect(paciente.nome).toBe('João Silva');
      });

      const req = httpMock.expectOne(`${BASE_URL}/pacientes/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaciente);
    });
  });

  describe('gravar()', () => {
    it('deve fazer POST em /pacientes quando paciente não tem id', () => {
      const novoPaciente = { id: 0, nome: 'Carlos Lima' };
      const mockResposta: Partial<Paciente> = { id: 3, nome: 'Carlos Lima' };

      service.gravar(novoPaciente).subscribe(paciente => {
        expect(paciente.id).toBe(3);
      });

      const req = httpMock.expectOne(`${BASE_URL}/pacientes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novoPaciente);
      req.flush(mockResposta);
    });

    it('deve fazer PUT em /pacientes/:id quando paciente já tem id', () => {
      const pacienteExistente = { id: 1, nome: 'João Silva Editado' };

      service.gravar(pacienteExistente).subscribe(paciente => {
        expect(paciente.nome).toBe('João Silva Editado');
      });

      const req = httpMock.expectOne(`${BASE_URL}/pacientes/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(pacienteExistente);
      req.flush(pacienteExistente);
    });
  });

  describe('excluir()', () => {
    it('deve fazer DELETE em /pacientes/:id', () => {
      service.excluir(1).subscribe(resposta => {
        expect(resposta).toBeNull();
      });

      const req = httpMock.expectOne(`${BASE_URL}/pacientes/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('total()', () => {
    it('deve fazer GET em /pacientes/total e retornar número', () => {
      service.total().subscribe(total => {
        expect(total).toBe(42);
      });

      const req = httpMock.expectOne(`${BASE_URL}/pacientes/total`);
      expect(req.request.method).toBe('GET');
      req.flush(42);
    });
  });
});
