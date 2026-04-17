import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { INIT_CONFIG } from '../config/init-config.token';
import { Exame } from '../domain/entities/exame';
import { ExameService } from "./exame.service";

const BASE_URL = 'http://localhost:8080';

describe('ExameService', () => {
  let service: ExameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: INIT_CONFIG, useValue: { urlBackend: BASE_URL } },
      ],
    });
    service = TestBed.inject(ExameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listarPorPaciente()', () => {
    it('deve fazer GET em /exames/:idPaciente e retornar lista', () => {
      const mockExames: Partial<Exame>[] = [
        { id: 1, descricao: 'Raio-X coluna', arquivo: 'raio-x.pdf' },
        { id: 2, descricao: 'Ressonância magnética', arquivo: 'rm.pdf' },
      ];

      service.listarPorPaciente(10).subscribe(exames => {
        expect(exames.length).toBe(2);
        expect(exames[0].descricao).toBe('Raio-X coluna');
        expect(exames[1].descricao).toBe('Ressonância magnética');
      });

      const req = httpMock.expectOne(`${BASE_URL}/exames/10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExames);
    });

    it('deve retornar lista vazia quando paciente não tem exames', () => {
      service.listarPorPaciente(99).subscribe(exames => {
        expect(exames.length).toBe(0);
      });

      const req = httpMock.expectOne(`${BASE_URL}/exames/99`);
      req.flush([]);
    });
  });

  describe('incluir()', () => {
    it('deve fazer POST em /exames com os dados do exame', () => {
      const novoExame = {
        paciente: { id: 10 },
        descricao: 'Eletrocardiograma',
        arquivo: 'data:application/pdf;base64,JVBERi0x...',
      };
      const mockResposta: Partial<Exame> = { id: 7, descricao: 'Eletrocardiograma' };

      service.incluir(novoExame).subscribe(exame => {
        expect(exame.id).toBe(7);
        expect(exame.descricao).toBe('Eletrocardiograma');
      });

      const req = httpMock.expectOne(`${BASE_URL}/exames`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novoExame);
      req.flush(mockResposta);
    });
  });

  describe('excluir()', () => {
    it('deve fazer DELETE em /exames/:id', () => {
      service.excluir(7).subscribe(resposta => {
        expect(resposta).toBeNull();
      });

      const req = httpMock.expectOne(`${BASE_URL}/exames/7`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('total()', () => {
    it('deve fazer GET em /exames/total e retornar número', () => {
      service.total().subscribe(total => {
        expect(total).toBe(300);
      });

      const req = httpMock.expectOne(`${BASE_URL}/exames/total`);
      expect(req.request.method).toBe('GET');
      req.flush(300);
    });
  });
});
