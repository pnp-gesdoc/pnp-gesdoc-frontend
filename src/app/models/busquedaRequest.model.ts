export class BusquedaRequestDto {
  asunto: string;
  dni: number;
  idTipoDocumento: number;
  siglas: string;
  usuario: string;
  ordenarPor: string = 'id';
  ordenarDireccion: string = 'desc';
  pagina: number = 0;
  tamano: number = 5;
}
