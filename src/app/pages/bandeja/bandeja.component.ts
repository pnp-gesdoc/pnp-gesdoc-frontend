import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {DocumentoService} from '../../services/documento.service';
import {DocumentoDataSource} from '../../services/documento.datasource';
import {TipoDocumento} from '../../models/tipoDocumento.model';
import {ConfigService} from '../../services/config.service';
import {ResultadoBusqueda} from '../../models/resultadoBusqueda.model';
import {BusquedaRequestDto} from '../../models/busquedaRequest.model';
import {NgxSpinnerService} from 'ngx-spinner';
import { MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent implements OnInit {

  environment;
  form: FormGroup;

  tiposDocumento: TipoDocumento[];
  public documentosDatasource : DocumentoDataSource;
  pageSize : number = 5;
  dataResult: ResultadoBusqueda;
  statusEliminado: number;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['id', 'dt.descripcion', 'asunto', 'numeroSiglas', 'acciones'];

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
    this.documentosDatasource = new DocumentoDataSource(this.documentoService, this.spinner);

    this.fnListarTiposDocumentos();
    this.fnDatatable('init');
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.fnDatatable())
        )
        .subscribe();
  }

  fnDatatable(from?: string) {
    const input = new BusquedaRequestDto();
    input.idTipoDocumento = this.form.controls.sTipoDocumento.value;
    input.dni = this.form.controls.sDni.value;
    input.siglas = this.form.controls.sSiglas.value;
    input.usuario = this.form.controls.sUsuario.value;
    input.asunto = this.form.controls.sAsunto.value;
    input.ordenarPor = this.sort.active;
    input.ordenarDireccion = this.sort.direction;
    input.pagina = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    input.tamano = this.paginator.pageSize ? this.paginator.pageSize : 5;

    if (from === 'delete') {
      this.configService.alert('Se eliminó el documento seleccionado');
    }
    this.documentosDatasource.cargarDetalleDocumentos(input);

  }

  fnOrdenarDatasource(evt: Event){
    this.fnDatatable('sort');
  }

  fnListarTiposDocumentos() {
    this.spinner.show();
    this.documentoService.listarTiposDocumentos().subscribe(data => {
      this.tiposDocumento = data;
    }, error => {
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    });
  }

  btnDelete(id: string) {
    this.spinner.show();
    this.documentoService.removeDocumento(id).subscribe(data => {
      this.statusEliminado = 1;
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
