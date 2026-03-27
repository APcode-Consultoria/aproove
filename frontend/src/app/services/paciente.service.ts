import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_PACIENTES } from "../config/api";
import { Paciente } from "../domain/entities/paciente";
import { INIT_CONFIG } from "../config/init-config.token";

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  public listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.initConfig.urlBackend}${API_PACIENTES}`);
  }

  public buscar(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.initConfig.urlBackend}${API_PACIENTES}/${id}`);
  }

  public gravar(paciente: any): Observable<Paciente> {
    if (paciente.id > 0) {
      return this.http.put<Paciente>(`${this.initConfig.urlBackend}${API_PACIENTES}/${paciente.id}`, paciente);
    }
    else {
      return this.http.post<Paciente>(`${this.initConfig.urlBackend}${API_PACIENTES}`, paciente);
    }
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${this.initConfig.urlBackend}${API_PACIENTES}/${id}`);
  }

  public total(): Observable<number> {
    return this.http.get<number>(`${this.initConfig.urlBackend}${API_PACIENTES}/total`);
  }

}
