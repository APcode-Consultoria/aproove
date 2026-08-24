/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_SERVICOS } from "../config/api";
import { Servico } from "../domain/entities/servico";
import { INIT_CONFIG } from "../config/init-config.token";
import { Periodicidade, PERIODICIDADE_LABELS } from "../domain/enums/periodicidade";

// Campos pesquisáveis do serviço (`pesquisavel` no .cruds/servico.yaml): o nome em modo
// `contem` (busca parcial, sem diferenciar maiúsculas de minúsculas) e a periodicidade
// em modo `exato`, por igualdade.
export interface ServicoFiltro {

  nome?: string;

  periodicidade?: Periodicidade;

}

export const SERVICO_CAMPOS_PESQUISA: { campo: keyof ServicoFiltro; label: string; tipo: string; enumLabels?: Record<string, string> }[] = [
  { campo: 'nome', label: 'Nome', tipo: 'texto' },
  { campo: 'periodicidade', label: 'Periodicidade', tipo: 'enum', enumLabels: PERIODICIDADE_LABELS }
];

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  public listar(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.initConfig.urlBackend}${API_SERVICOS}`);
  }

  public pesquisar(filtro: ServicoFiltro): Observable<Servico[]> {
    let params = new HttpParams();
    SERVICO_CAMPOS_PESQUISA.forEach(({ campo }) => {
      const valor = filtro[campo]?.trim();
      if (valor)
        params = params.set(campo, valor);
    });

    return this.http.get<Servico[]>(`${this.initConfig.urlBackend}${API_SERVICOS}/pesquisar`, { params });
  }

  public buscar(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.initConfig.urlBackend}${API_SERVICOS}/${id}`);
  }

  public incluir(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(`${this.initConfig.urlBackend}${API_SERVICOS}`, servico);
  }

  public alterar(servico: Servico, id: number): Observable<Servico> {
    return this.http.put<Servico>(`${this.initConfig.urlBackend}${API_SERVICOS}/${id}`, servico);
  }

  public excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.initConfig.urlBackend}${API_SERVICOS}/${id}`);
  }

}
