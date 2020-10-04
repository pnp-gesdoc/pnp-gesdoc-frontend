import { ResultadoBusquedaDocumento } from './resultadoBusquedaDocumento.model';
import { Usuario } from './usuario.model';

export class ResultadoBusquedaUsuario {
  usuarios : Usuario[]
  paginas : number;
  total : number;
}
