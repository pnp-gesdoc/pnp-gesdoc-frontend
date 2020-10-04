import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Usuario} from '../../models/usuario.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  dataSource: MatTableDataSource<Usuario>;
  displayedColumns = ['item', 'dni', 'nombres', 'apellidos', 'correo', 'acciones'];

  constructor(public dialog: MatDialogRef<UsuariosComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog: Usuario[]) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Usuario>(this.dataDialog);
  }

  select(element: Usuario) {
    this.dialog.close(element);
  }

}
