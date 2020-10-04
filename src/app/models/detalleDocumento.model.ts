import {Usuario} from './usuario.model';

export class DetalleDocumento {

  asunto: string;
  siglas: string;
  tipoDocumentoDesc: string;
  extension: string;
  archivo: string;
  usuarios: Usuario[];
  xArchivo: string;
}
