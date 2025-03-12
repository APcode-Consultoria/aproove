import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_EXAMES } from "../config/api";
import { Exame } from "../domain/entities/exame";

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  constructor(
      private http: HttpClient
  ) { }

  public listarPorPaciente(idPaciente: number): Observable<Exame[]> {
    return this.http.get<Exame[]>(`${environment.urlBackend}${API_EXAMES}/${idPaciente}`);
  }

  public incluir(exame: any): Observable<Exame> {
    return this.http.post<Exame>(`${environment.urlBackend}${API_EXAMES}`, exame);
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${environment.urlBackend}${API_EXAMES}/${id}`);
  }

  public total(): Observable<number> {
    return this.http.get<number>(`${environment.urlBackend}${API_EXAMES}/total`);
  }

}
