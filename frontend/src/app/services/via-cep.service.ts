import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  constructor(
    private http: HttpClient
  ) { }

  public consultarCep(cep: string): Observable<Endereco> {
    return this.http.get<Endereco>(`https://viacep.com.br/ws/${cep}/json/`);
  }

}