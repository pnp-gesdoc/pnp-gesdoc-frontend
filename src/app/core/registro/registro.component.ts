import { Component, OnInit } from '@angular/core';
import {DocumentoService} from '../../services/documento.service';
import {TipoDocumento} from '../../models/tipoDocumento.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {ConfigService} from '../../services/config.service';
import {RegistroRequestDto} from '../../dto/registroRequest.dto';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioService} from '../../services/usuario.service';
import {Usuario} from '../../models/usuario.model';
import {MatTableDataSource} from '@angular/material/table';
import {element} from 'protractor';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  environment;
  form: FormGroup;

  tiposDocumento: TipoDocumento[];

  fileBlob: string;

  registroExitoso: number;

  usuarios: Usuario[];
  usuariosGrilla: Usuario[] = [];

  dataSource: MatTableDataSource<Usuario>;
  displayedColumns: string[] = ['item', 'dni', 'nombres', 'apellidos', 'correo', 'acciones'];

  constructor(public configService: ConfigService,
              private documentoService: DocumentoService,
              private usuarioService: UsuarioService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.environment = environment;
    this.form = new FormGroup({
      'sTipoDocumento': new FormControl('', [Validators.required]),
      'sSiglas': new FormControl({value: '', disabled: true}, [Validators.required]),
      'sAsunto': new FormControl('', [Validators.required]),
      'sFile': new FormControl('', [Validators.required]),
    });

    this.fnListarTiposDocumentos();
  }

  setAutoGenerate() {
    this.spinner.show();
    this.documentoService.getCalculaSigla(this.form.controls.sTipoDocumento.value).subscribe(data => {
      this.form.controls.sSiglas.setValue(data);
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });
  }

  btnUsuarios() {
    this.spinner.show();
    this.usuarioService.listarUsuariosTabla().subscribe(data => {
      this.usuarios = data;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
      const dialogRef = this.configService.getUsuarios(this.usuarios);
      dialogRef.afterClosed().subscribe((selected: Usuario) => {
        if (selected) {
          this.usuariosGrilla.push(selected);
          this.dataSource = new MatTableDataSource<Usuario>();
          this.dataSource.data = this.usuariosGrilla;
        }
      });
    });
  }

  delete(item) {
    this.usuariosGrilla.splice(this.usuariosGrilla.indexOf(item, 0), 1);
    this.dataSource._updateChangeSubscription();
  }

  registrar() {
    if (this.form.invalid) {
      this.configService.alert('Debe cumplir con los datos requeridos');
      return;
    }

    const input = new RegistroRequestDto();
    input.documentotipoid = this.form.controls.sTipoDocumento.value;
    input.numerosiglas = this.form.controls.sSiglas.value;
    input.asunto = this.form.controls.sAsunto.value;
    input.archivo = this.form.controls.sFile.value ? this.form.controls.sFile.value.files[0].name : '';
    input.xArchivo = this.form.controls.sFile.value ? this.fileBlob : '';
    input.usuarios = this.usuariosGrilla;

    this.spinner.show();
    this.documentoService.registrar(input).subscribe(data => {
      this.registroExitoso =1 ;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
      if (this.registroExitoso === environment.INT_ONE) {
        this.configService.alert('Registro existoso');
        this.configService.link('bandeja');
      } else {
        this.configService.alert('Error al registrar');
      }
    });

  }

  uploadFile(event) {
    if (event.target.value) {
      const file = event.target.files[0];
      this.changeFile(file).then((base64: string): any => {
        this.fileBlob = base64.split(',')[1];
      });
    } else {
      this.configService.alert('No se pudo cargar el archivo');
    }
  }

  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  fnListarTiposDocumentos() {
    this.documentoService.listarTiposDocumentos().subscribe(data => {
      this.tiposDocumento = data;
    });
  }

}
