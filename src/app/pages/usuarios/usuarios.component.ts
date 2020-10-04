import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Usuario} from '../../models/usuario.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UsuarioDataSource } from 'src/app/services/usuario.datasource';
import { MatPaginator, MatSort } from '@angular/material';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusquedaUsuarioRequest } from 'src/app/models/busquedaUsuarioRequest.model';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} }
]
})
export class UsuariosComponent implements OnInit {

  dataSource: UsuarioDataSource;
  public pageSize : number = 5;
  displayedColumns = ['item', 'dni', 'nombres', 'apellidos', 'correo'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialogRef<UsuariosComponent>,
              public usuarioService : UsuarioService,
              private spinner: NgxSpinnerService,
              @Inject(MAT_DIALOG_DATA) public dataDialog: Usuario[]) { }

  ngOnInit() {

    this.dataSource = new UsuarioDataSource(this.usuarioService, this.spinner);
    this.fnDatatable();
  }

  fnOrdenarDatasource(evt: Event){
    this.fnDatatable();
  }

  ngAfterViewInit() {
    console.log('after');
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.fnDatatable())
        )
        .subscribe();
  }

  fnDatatable() {
    const input = new BusquedaUsuarioRequest();
    input.ordenarPor = this.sort.active;
    input.ordenarDireccion = this.sort.direction;
    input.pagina = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    input.tamano = this.paginator.pageSize ? this.paginator.pageSize : 5;

    this.dataSource.cargarUsuarios(input);

  }

  select(element: Usuario) {

    this.dialog.close(element);
  }

}
