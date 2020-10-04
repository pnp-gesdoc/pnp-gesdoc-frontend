import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _urlService = environment.URL_SVC_GDPNP;
  url = `${this._urlService}/usuarios`;

  constructor(private http: HttpClient) { }

  listarUsuariosTabla() {
    return this.http.get<Usuario[]>(`${this.url}`);
  }
}
