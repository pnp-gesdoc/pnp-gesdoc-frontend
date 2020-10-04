import { Component, OnInit } from '@angular/core';
import {DocumentoService} from '../../services/documento.service';
import {TipoDocumento} from '../../models/tipoDocumento.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {ConfigService} from '../../services/config.service';
import {RegistroRequestDto} from '../../models/registroRequest.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {UsuarioService} from '../../services/usuario.service';
import {Usuario} from '../../models/usuario.model';
import {MatTableDataSource} from '@angular/material/table';

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
  displayedColumns: string[] = ['dni', 'nombres', 'apellidos', 'correo', 'acciones'];

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
      console.log(data);
      this.form.controls.sSiglas.setValue(data.numeroSiglas);
    }, error => {
      console.log(error);
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });
  }

  btnUsuarios() {
    const dialogRef = this.configService.getUsuarios(this.usuarios);
    dialogRef.afterClosed().subscribe((selected: Usuario) => {
      if (selected) {
        let buscar = this.usuariosGrilla.find(x => x.id === selected.id);
        if(buscar){
          this.configService.alert('Usuario ya se encuentra agregado');
        }else{
          this.usuariosGrilla.push(selected);
        }

        this.dataSource = new MatTableDataSource<Usuario>();
        this.dataSource.data = this.usuariosGrilla;
      }
    });
  }

  delete(item) {
    this.usuariosGrilla.splice(this.usuariosGrilla.indexOf(item, 0), 1);
    this.dataSource._updateChangeSubscription();
  }

  registrar() {
    if (this.form.invalid) {
      this.configService.alert('Por favor complete los campos obligatorios');
      return;
    }

    const input = new RegistroRequestDto();
    input.documentotipoid = this.form.controls.sTipoDocumento.value;
    input.numerosiglas = this.form.controls.sSiglas.value;
    input.asunto = this.form.controls.sAsunto.value;
    let file = this.form.controls.sFile.value ? this.form.controls.sFile.value.files[0] : undefined;
    input.archivo = this.form.controls.sFile.value ? this.form.controls.sFile.value.files[0].name : '';
    input.usuarios = this.usuariosGrilla;

    console.log(this.form);
    console.log();

    this.spinner.show();
    this.documentoService.registrar(input, file).pipe(
      // switchMap(res => {
      //   return this.documentoService.cargarArchivo(res.body.toString(), input.archivoBlob );
      // })
    ).subscribe(data => {
      this.registroExitoso = 1;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
      if (this.registroExitoso === environment.INT_ONE) {
        this.configService.alert('Se registró el documento');
        this.configService.link('bandeja');
      } else {
        this.configService.alert('Ocurrió un error al registrar el documento');
      }
    });

  }

  uploadFile(event) {
    if (event.target.value) {
      const file = event.target.files[0];
    } else {
      this.configService.alert('No se pudo cargar el archivo');
    }
  }

  fnListarTiposDocumentos() {
    this.documentoService.listarTiposDocumentos().subscribe(data => {
      this.tiposDocumento = data;
    });
  }

}
