import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_EXAMES } from "../config/api";
import { Exame } from "../domain/entities/exame";
import { INIT_CONFIG } from "../config/init-config.token";

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  private http = inject(HttpClient);
  private initConfig = inject(INIT_CONFIG);

  public listarPorPaciente(idPaciente: number): Observable<Exame[]> {
    return this.http.get<Exame[]>(`${this.initConfig.urlBackend}${API_EXAMES}/${idPaciente}`);
  }

  public incluir(exame: any): Observable<Exame> {
    return this.http.post<Exame>(`${this.initConfig.urlBackend}${API_EXAMES}`, exame);
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${this.initConfig.urlBackend}${API_EXAMES}/${id}`);
  }

  public total(): Observable<number> {
    return this.http.get<number>(`${this.initConfig.urlBackend}${API_EXAMES}/total`);
  }

}
