import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Api} from '../config/api';
import {environment} from '../../environments/environment';
import {Prontuario} from '../models/prontuario';

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  constructor(
    private http: HttpClient
  ) { }

  public listarPorPaciente(idPaciente: number): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`${environment.backendURL}${Api.PRONTUARIOS}/${idPaciente}`);
  }

  public incluir(prontuario: any): Observable<Prontuario> {
    return this.http.post<Prontuario>(`${environment.backendURL}${Api.PRONTUARIOS}`, prontuario);
  }

  public excluir(id: number): Observable<any> {
    return this.http.delete(`${environment.backendURL}${Api.PRONTUARIOS}/${id}`);
  }

}
