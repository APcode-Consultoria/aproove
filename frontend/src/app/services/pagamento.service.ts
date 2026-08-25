/*
 * Autor: André Penteado
 * Criado em: 24/08/2026 13:15:55 -03
 * Observação: arquivo criado com ajuda da IA.
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_PAGAMENTOS } from "../config/api";
import { Pagamento } from "../domain/entities/pagamento";
import { INIT_CONFIG } from "../config/init-config.token";

// Filtro da tela de pagamentos. Os três switches são alternativas da mesma pergunta e
// somam entre si com OR; o período recorta por data de vencimento, com AND.
export interface PagamentoFiltro {

  pagos?: boolean;

  vencidos?: boolean;

  aVencer?: boolean;

  inicio?: string;

  fim?: string;

}

export const PAGAMENTO_CAMPOS_PESQUISA: { campo: keyof PagamentoFiltro; label: string; tipo: string }[] = [
  { campo: 'pagos', label: 'Pagos', tipo: 'booleano' },
  { campo: 'vencidos', label: 'Vencidos', tipo: 'booleano' },
  { campo: 'aVencer', label: 'A vencer', tipo: 'booleano' },
  { campo: 'inicio', label: 'Vencimento de', tipo: 'data' },
  { campo: 'fim', label: 'Vencimento até', tipo: 'data' }
];

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  public listar(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.initConfig.urlBackend}${API_PAGAMENTOS}`);
  }

  public pesquisar(filtro: PagamentoFiltro): Observable<Pagamento[]> {
    let params = new HttpParams();
    PAGAMENTO_CAMPOS_PESQUISA.forEach(({ campo }) => {
      const valor = filtro[campo];
      // Switch desligado não vira parâmetro: só o `true` filtra.
      if (valor === true || (typeof valor === 'string' && valor.trim()))
        params = params.set(campo, String(valor));
    });
    return this.http.get<Pagamento[]>(`${this.initConfig.urlBackend}${API_PAGAMENTOS}/pesquisar`, { params });
  }

  public listarPorPaciente(idPaciente: number): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.initConfig.urlBackend}${API_PAGAMENTOS}/por-paciente/${idPaciente}`);
  }

  public buscar(id: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.initConfig.urlBackend}${API_PAGAMENTOS}/${id}`);
  }

  public incluir(pagamento: any): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.initConfig.urlBackend}${API_PAGAMENTOS}`, pagamento);
  }

  // Caminho da ação Pagar: preenche data e valor pagos do registro existente. O backend
  // repõe contratação, vencimento e valor, e renova a contratação quando ela está aberta.
  public alterar(pagamento: any, id: number): Observable<Pagamento> {
    return this.http.put<Pagamento>(`${this.initConfig.urlBackend}${API_PAGAMENTOS}/${id}`, pagamento);
  }

  public excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.initConfig.urlBackend}${API_PAGAMENTOS}/${id}`);
  }

}
