import {Usuario} from '../models/usuario.model';

export class RegistroRequestDto {
  archivo: string;
  asunto: string;
  documentotipoid: number;
  numerosiglas: string;
  usuarios: Usuario[];
}
