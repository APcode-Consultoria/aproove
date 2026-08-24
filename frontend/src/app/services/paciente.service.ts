import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_PACIENTES } from "../config/api";
import { Paciente } from "../domain/entities/paciente";
import { INIT_CONFIG } from "../config/init-config.token";

// Campos pesquisáveis do paciente (`pesquisavel` no .cruds/paciente.yaml). Todos são
// texto e a busca é parcial, sem diferenciar maiúsculas de minúsculas.
export interface PacienteFiltro {

  nome?: string;

  cpf?: string;

  telefone?: string;

  email?: string;

}

export const PACIENTE_CAMPOS_PESQUISA: { campo: keyof PacienteFiltro; label: string; tipo: string }[] = [
  { campo: 'nome', label: 'Nome', tipo: 'string' },
  { campo: 'cpf', label: 'CPF', tipo: 'string' },
  { campo: 'telefone', label: 'Telefone', tipo: 'string' },
  { campo: 'email', label: 'E-mail', tipo: 'string' }
];

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  public listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.initConfig.urlBackend}${API_PACIENTES}`);
  }

  public pesquisar(filtro: PacienteFiltro): Observable<Paciente[]> {
    let params = new HttpParams();
    PACIENTE_CAMPOS_PESQUISA.forEach(({ campo }) => {
      const valor = filtro[campo]?.trim();
      if (valor)
        params = params.set(campo, valor);
    });
    return this.http.get<Paciente[]>(`${this.initConfig.urlBackend}${API_PACIENTES}/pesquisar`, { params });
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
