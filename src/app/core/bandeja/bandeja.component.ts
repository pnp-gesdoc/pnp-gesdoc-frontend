import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {DocumentoService} from '../../services/documento.service';
import {TipoDocumento} from '../../models/tipoDocumento.model';
import {ConfigService} from '../../services/config.service';
import {ResultadoBusqueda} from '../../models/resultadoBusqueda.model';
import {BusquedaRequestDto} from '../../dto/busquedaRequest.dto';
import {NgxSpinnerService} from 'ngx-spinner';
import { ResultadoBusquedaDocumento } from 'src/app/models/resultadoBusquedaDocumento.model';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent implements OnInit {

  environment;
  form: FormGroup;

  tiposDocumento: TipoDocumento[];
  dataResult: ResultadoBusquedaDocumento[];
  statusEliminado: number;

  displayedColumns: string[] = ['item', 'tipoDocumento', 'asunto', 'numeroSiglas', 'acciones'];

  constructor(public configService: ConfigService,
              private documentoService: DocumentoService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.environment = environment;
    this.form = new FormGroup({
      'sTipoDocumento': new FormControl(''),
      'sDni': new FormControl(''),
      'sSiglas': new FormControl(''),
      'sUsuario': new FormControl(''),
      'sAsunto': new FormControl(''),
    });

    this.fnListarTiposDocumentos();
  }

  fnDatatable(from?: string) {
    const input = new BusquedaRequestDto();
    input.idTipoDocumento = this.form.controls.sTipoDocumento.value;
    input.dni = this.form.controls.sDni.value;
    input.siglas = this.form.controls.sSiglas.value;
    input.usuario = this.form.controls.sUsuario.value;
    input.asunto = this.form.controls.sAsunto.value;

    this.spinner.show();
    this.documentoService.listarDocumentosTabla(input).subscribe(data => {
      this.dataResult = data.documentos;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
      if (from === 'delete') {
        this.configService.alert('Registro eliminado');
      }
    });
  }

  fnListarTiposDocumentos() {
    this.spinner.show();
    this.documentoService.listarTiposDocumentos().subscribe(data => {
      this.tiposDocumento = data;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.fnDatatable();
    });
  }

  btnDelete(id: string) {
    this.spinner.show();
    this.documentoService.removeDocumento(id).subscribe(data => {
      //this.statusEliminado = data;
    }, error => {
      this.spinner.hide();
    }, () => {
      if (this.statusEliminado === environment.INT_ONE) {
        this.fnDatatable('delete');
      } else {
        this.configService.alert('No se pudo eliminar el registro');
      }
    });
  }

  btnNuevo() {
    this.configService.link('registro');
  }

  btnVer(id: number) {
    this.configService.link(`detalle/${id}`);
  }

}
