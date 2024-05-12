import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prontuario } from '../models/prontuario';
import { API_PRONTUARIOS } from "../etc/api";

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  constructor(
    private http: HttpClient
  ) { }

  public listarPorPaciente(idPaciente: number): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`${environment.backendURL}${API_PRONTUARIOS}/${idPaciente}`);
  }

  public incluir(prontuario: any): Observable<Prontuario> {
    return this.http.post<Prontuario>(`${environment.backendURL}${API_PRONTUARIOS}`, prontuario);
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${environment.backendURL}${API_PRONTUARIOS}/${id}`);
  }

  public total(): Observable<number> {
    return this.http.get<number>(`${environment.backendURL}${API_PRONTUARIOS}/total`);
  }

}
