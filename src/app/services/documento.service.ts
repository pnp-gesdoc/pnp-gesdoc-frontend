import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DetalleDocumento} from '../models/detalleDocumento.model';
import {BusquedaRequestDto} from '../dto/busquedaRequest.dto';
import {RegistroRequestDto} from '../dto/registroRequest.dto';
import { TipoDocumento } from '../models/tipoDocumento.model';
import { ResultadoBusqueda } from '../models/resultadoBusqueda.model';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private _urlService = environment.URL_SVC_GDPNP;
  url = `${this._urlService}/documentos`;

  constructor(private http: HttpClient) { }

  listarTiposDocumentos() {
    return this.http.get<TipoDocumento[]>(`${this._urlService}/tipos`);
  }

  listarDocumentosTabla(busquedaRequest: BusquedaRequestDto) {
    let params : HttpParams;
    if(busquedaRequest.usuario){
      params = params.set("usuario", busquedaRequest.usuario);
    }
    if(busquedaRequest.asunto){
      params = params.set("asunto", busquedaRequest.asunto);
    }
    if(busquedaRequest.dni){
      params = params.set("dni", busquedaRequest.dni.toString());
    }
    if(busquedaRequest.idTipoDocumento){
      params = params.set("idTipoDocumento", busquedaRequest.idTipoDocumento.toString());
    }
    if(busquedaRequest.siglas){
      params = params.set("siglas", busquedaRequest.siglas.toString());
    }
    return this.http.get<ResultadoBusqueda>(`${this.url}`, { params : params });
  }

  getDocumento(idDocumento: string) {
    return this.http.get<DetalleDocumento>(`${this.url}/${idDocumento}`);
  }

  descargarArchivo(idDocumento: string) {
    let params : HttpParams;
    return this.http.get(`${this.url}/${idDocumento}/archivo`, {
      responseType: "blob",
      params: params,
      observe: 'response'
    });

  }

  removeDocumento(idDocumento: string) {
    return this.http.delete<string>(`${this.url}/${idDocumento}`);
  }

  getCalculaSigla(tipoDocumento: string) {
    return this.http.get<string>(`${this.url}/siglas/${tipoDocumento}`);
  }

  registrar(dto: RegistroRequestDto) {
    return this.http.post<string>(`${this.url}`, dto);
  }
}
