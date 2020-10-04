import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DetalleDocumento} from '../models/detalleDocumento.model';
import {BusquedaRequestDto} from '../models/busquedaRequest.model';
import {RegistroRequestDto} from '../models/registroRequest.model';
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
    let params = new HttpParams();
    Object.keys(busquedaRequest).map(k =>{
      if(busquedaRequest[k] && busquedaRequest[k]!==""){
        params=params.set(k, busquedaRequest[k]);
      }
    });

    return this.http.get<ResultadoBusqueda>(`${this.url}`, { params : params });
  }

  getDocumento(idDocumento: string) {
    return this.http.get<DetalleDocumento>(`${this.url}/${idDocumento}`);
  }

  descargarArchivo(idDocumento: string) {
    let params : HttpParams;
    return this.http.get(this.obtenerLinkArchivo(idDocumento), {
      responseType: "blob",
      params: params,
      observe: 'response'
    });
  }

  obtenerLinkArchivo(idDocumento: string){
    return `${this.url}/${idDocumento}/archivo`;
  }

  cargarArchivo(idDocumento: string, file: File){
    let formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.url}/${idDocumento}/archivo`, formData);
  }

  removeDocumento(idDocumento: string) {
    return this.http.delete<string>(`${this.url}/${idDocumento}`);
  }

  getCalculaSigla(tipoDocumento: string) {
    return this.http.get<any>(`${this.url}/siglas/${tipoDocumento}`);
  }

  registrar(dto: RegistroRequestDto, archivo : File) {
    let formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    formData.append('documento', new Blob([
      JSON.stringify(dto)
    ], {
        type: "application/json"
    }));
    return this.http.post(`${this.url}/registrar`, formData , { headers: {'OverrideContentType': 'yes'} });
  }
}
