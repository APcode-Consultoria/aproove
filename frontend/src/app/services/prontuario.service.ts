import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente';
import { Api } from '../config/api';
import { environment } from '../../environments/environment';
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

}
