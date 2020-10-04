import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Usuario} from '../models/usuario.model';
import { ResultadoBusquedaUsuario } from '../models/resultadoBusquedaUsuario.model';
import { BusquedaUsuarioRequest } from '../models/busquedaUsuarioRequest.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _urlService = environment.URL_SVC_GDPNP;
  url = `${this._urlService}/usuarios`;

  constructor(private http: HttpClient) { }

  listarUsuariosTabla(busquedaUsuarioRequest : BusquedaUsuarioRequest) {
    let params = new HttpParams();
    Object.keys(busquedaUsuarioRequest).map(k =>{
      if(busquedaUsuarioRequest[k] && busquedaUsuarioRequest[k]!==""){
        params=params.set(k, busquedaUsuarioRequest[k]);
      }
    });

    return this.http.get<ResultadoBusquedaUsuario>(`${this.url}`, { params : params });
  }


}
