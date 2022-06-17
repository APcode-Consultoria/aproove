import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(
    private http: HttpClient
  ) { }

  public listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`http://localhost:8080/pacientes`);
  }

  public buscar(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`http://localhost:8080/pacientes/${id}`);
  }

  public gravar(paciente: Paciente): Observable<Paciente> {
    if (paciente.id > 0) {
      return this.http.put<Paciente>(`http://localhost:8080/pacientes/${paciente.id}`, paciente);
    }
    else {
      return this.http.post<Paciente>(`http://localhost:8080/pacientes`, paciente);
    }
  }

}