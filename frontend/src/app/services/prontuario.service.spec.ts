import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProntuarioService } from './prontuario.service';
import { INIT_CONFIG } from '../config/init-config.token';
import { Prontuario } from '../domain/entities/prontuario';

const BASE_URL = 'http://localhost:8080';

describe('ProntuarioService', () => {
  let service: ProntuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: INIT_CONFIG, useValue: { urlBackend: BASE_URL } },
      ],
    });
    service = TestBed.inject(ProntuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listarPorPaciente()', () => {
    it('deve fazer GET em /prontuarios/:idPaciente e retornar lista', () => {
      const mockProntuarios: Partial<Prontuario>[] = [
        { id: 1, atendimento: 'Primeira consulta' },
        { id: 2, atendimento: 'Retorno' },
      ];

      service.listarPorPaciente(10).subscribe(prontuarios => {
        expect(prontuarios.length).toBe(2);
        expect(prontuarios[0].atendimento).toBe('Primeira consulta');
        expect(prontuarios[1].atendimento).toBe('Retorno');
      });

      const req = httpMock.expectOne(`${BASE_URL}/prontuarios/10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProntuarios);
    });

    it('deve retornar lista vazia quando paciente não tem prontuários', () => {
      service.listarPorPaciente(99).subscribe(prontuarios => {
        expect(prontuarios.length).toBe(0);
      });

      const req = httpMock.expectOne(`${BASE_URL}/prontuarios/99`);
      req.flush([]);
    });
  });

  describe('incluir()', () => {
    it('deve fazer POST em /prontuarios com os dados do prontuário', () => {
      const novoProntuario = { paciente: { id: 10 }, atendimento: 'Nova sessão de fisioterapia' };
      const mockResposta: Partial<Prontuario> = { id: 5, atendimento: 'Nova sessão de fisioterapia' };

      service.incluir(novoProntuario).subscribe(prontuario => {
        expect(prontuario.id).toBe(5);
        expect(prontuario.atendimento).toBe('Nova sessão de fisioterapia');
      });

      const req = httpMock.expectOne(`${BASE_URL}/prontuarios`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novoProntuario);
      req.flush(mockResposta);
    });
  });

  describe('excluir()', () => {
    it('deve fazer DELETE em /prontuarios/:id', () => {
      service.excluir(5).subscribe(resposta => {
        expect(resposta).toBeNull();
      });

      const req = httpMock.expectOne(`${BASE_URL}/prontuarios/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('total()', () => {
    it('deve fazer GET em /prontuarios/total e retornar número', () => {
      service.total().subscribe(total => {
        expect(total).toBe(150);
      });

      const req = httpMock.expectOne(`${BASE_URL}/prontuarios/total`);
      expect(req.request.method).toBe('GET');
      req.flush(150);
    });
  });
});
