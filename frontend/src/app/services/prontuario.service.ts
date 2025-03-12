import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_PRONTUARIOS } from "../config/api";
import { Prontuario } from "../domain/entities/prontuario";

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  constructor(
    private http: HttpClient
  ) { }

  public listarPorPaciente(idPaciente: number): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`${environment.urlBackend}${API_PRONTUARIOS}/${idPaciente}`);
  }

  public incluir(prontuario: any): Observable<Prontuario> {
    return this.http.post<Prontuario>(`${environment.urlBackend}${API_PRONTUARIOS}`, prontuario);
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${environment.urlBackend}${API_PRONTUARIOS}/${id}`);
  }

  public total(): Observable<number> {
    return this.http.get<number>(`${environment.urlBackend}${API_PRONTUARIOS}/total`);
  }

}
