import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Api} from '../config/api';
import {Exame} from '../models/exame';

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  constructor(
      private http: HttpClient
  ) { }

  public listarPorPaciente(idPaciente: number): Observable<Exame[]> {
    return this.http.get<Exame[]>(`${environment.backendURL}${Api.EXAMES}/${idPaciente}`);
  }

  public incluir(exame: any): Observable<Exame> {
    return this.http.post<Exame>(`${environment.backendURL}${Api.EXAMES}`, exame);
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${environment.backendURL}${Api.EXAMES}/${id}`);
  }

}
