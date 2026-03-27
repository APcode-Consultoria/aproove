import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_PRONTUARIOS } from "../config/api";
import { Prontuario } from "../domain/entities/prontuario";
import { INIT_CONFIG } from "../config/init-config.token";

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  public listarPorPaciente(idPaciente: number): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`${this.initConfig.urlBackend}${API_PRONTUARIOS}/${idPaciente}`);
  }

  public incluir(prontuario: any): Observable<Prontuario> {
    return this.http.post<Prontuario>(`${this.initConfig.urlBackend}${API_PRONTUARIOS}`, prontuario);
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${this.initConfig.urlBackend}${API_PRONTUARIOS}/${id}`);
  }

  public total(): Observable<number> {
    return this.http.get<number>(`${this.initConfig.urlBackend}${API_PRONTUARIOS}/total`);
  }

}
