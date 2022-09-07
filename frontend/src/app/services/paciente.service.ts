import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente';
import { Api } from '../config/api';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(
    private http: HttpClient
  ) { }

  public listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${environment.backendURL}${Api.PACIENTES}`);
  }

  public buscar(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${environment.backendURL}${Api.PACIENTES}/${id}`);
  }

  public gravar(paciente: any): Observable<Paciente> {
    if (paciente.id > 0) {
      return this.http.put<Paciente>(`${environment.backendURL}${Api.PACIENTES}/${paciente.id}`, paciente);
    }
    else {
      return this.http.post<Paciente>(`${environment.backendURL}${Api.PACIENTES}`, paciente);
    }
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${environment.backendURL}${Api.PACIENTES}/${id}`);
  }

  public total(): Observable<number> {
    return this.http.get<number>(`${environment.backendURL}${Api.PACIENTES}/total`);
  }

}
