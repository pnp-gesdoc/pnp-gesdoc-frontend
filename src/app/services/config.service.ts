import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';
import {VisorArchivoComponent} from '../pages/visor-archivo/visor-archivo.component';
import {Usuario} from '../models/usuario.model';
import {UsuariosComponent} from '../pages/usuarios/usuarios.component';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private route: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  link(url: string) {
    this.route.navigate([url]);
  }

  alert(message: string, positionVertical?: any, positionHorizontal?: any, actionButton?: string, duration?: number) {
    this.snackBar.open(message, actionButton ? actionButton : 'Ok', {
      verticalPosition: positionVertical ? positionVertical : 'bottom',
      horizontalPosition: positionHorizontal ? positionHorizontal  : 'center',
      duration: duration ? duration : 3000,
    });
  }

  getErrorMessage(formName: FormGroup, formControl, min?: number, max?: number, onlyNumber?: boolean, mail?: boolean) {
    return formName.get(formControl).hasError('required') ? 'Requerido' :
      formName.get(formControl).hasError('maxlength') ? `Máximo ${max} caracteres` :
        formName.get(formControl).hasError('minlength') ? `Mínimo ${min} caracteres` :
          formName.get(formControl).hasError('email') ? 'Debe ingresar un correo electrónico válido' :
            formName.get(formControl).hasError('pattern') ? (mail ? `Correo electrónico inválido` : `Sólo ${onlyNumber ? 'números y sin espacios en blanco' : 'letras y números'}`) :
              '';
  }

  getUsuarios(usuarios: Usuario[]) {
    return this.dialog.open(UsuariosComponent, {
      width: '1000px',
      data: usuarios,
    });
  }

  getVisorArchivo(blob: Blob) {
    return this.dialog.open(VisorArchivoComponent, {
      width: '1000px',
      data: {pdfBlob: blob},
    });
  }

  getConfirmation(comp: any, title: string, message: string) {
    return this.dialog.open(comp, {
      width: '500px',
      data: {title: title, message: message},
    });
  }

  setItemStorage(item, value) {
    sessionStorage.setItem(item, JSON.stringify(value));
  }

  getItemStorage(item) {
    const datos = sessionStorage.getItem(item);
    const json = this.validateJson(datos);
    return datos ? JSON.parse(json) : null;
  }

  removeItemStorage(item) {
    sessionStorage.removeItem(item);
  }

  validateJson(json) {
    try {
      JSON.parse(json);
    } catch (e) {
      return null;
    }
    return json;
  }

}
