/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_SERVICOS_CONTRATADOS } from "../config/api";
import { ServicoContratado } from "../domain/entities/servico-contratado";
import { INIT_CONFIG } from "../config/init-config.token";

@Injectable({
  providedIn: 'root'
})
export class ServicoContratadoService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  public listarPorPaciente(idPaciente: number): Observable<ServicoContratado[]> {
    return this.http.get<ServicoContratado[]>(`${this.initConfig.urlBackend}${API_SERVICOS_CONTRATADOS}/por-paciente/${idPaciente}`);
  }

  public buscar(id: number): Observable<ServicoContratado> {
    return this.http.get<ServicoContratado>(`${this.initConfig.urlBackend}${API_SERVICOS_CONTRATADOS}/${id}`);
  }

  public incluir(servicoContratado: any): Observable<ServicoContratado> {
    return this.http.post<ServicoContratado>(`${this.initConfig.urlBackend}${API_SERVICOS_CONTRATADOS}`, servicoContratado);
  }

  public alterar(servicoContratado: any, id: number): Observable<ServicoContratado> {
    return this.http.put<ServicoContratado>(`${this.initConfig.urlBackend}${API_SERVICOS_CONTRATADOS}/${id}`, servicoContratado);
  }

  // Comando sobre um registro: sem body, o backend grava a data de hoje no fim da
  // contratação e devolve a contratação já encerrada.
  public encerrar(id: number): Observable<ServicoContratado> {
    return this.http.post<ServicoContratado>(`${this.initConfig.urlBackend}${API_SERVICOS_CONTRATADOS}/${id}/encerrar`, {});
  }

  public excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.initConfig.urlBackend}${API_SERVICOS_CONTRATADOS}/${id}`);
  }

}
