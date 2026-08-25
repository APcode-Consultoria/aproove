/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_AGENDA } from "../config/api";
import { AgendaAtendimento } from "../domain/entities/agenda-atendimento";
import { INIT_CONFIG } from "../config/init-config.token";

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  // `responsavel` só é respeitado para o DIRETOR: o backend força o próprio login para
  // os demais perfis, então a tela não é a barreira.
  public listar(inicio: string, fim: string, responsavel?: string): Observable<AgendaAtendimento[]> {
    let params = new HttpParams().set('inicio', inicio).set('fim', fim);
    if (responsavel?.trim())
      params = params.set('responsavel', responsavel.trim());

    return this.http.get<AgendaAtendimento[]>(`${this.initConfig.urlBackend}${API_AGENDA}`, { params });
  }

}
