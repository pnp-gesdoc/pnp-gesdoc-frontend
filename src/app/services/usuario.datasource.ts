import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario.model';
import { BusquedaUsuarioRequest } from '../models/busquedaUsuarioRequest.model';

export class UsuarioDataSource implements DataSource<Usuario> {

    private usuarioSubject = new BehaviorSubject<Usuario[]>([]);
    public total: number;

    constructor(private usuarioService: UsuarioService,
                private spinner: NgxSpinnerService) {

    }

    cargarUsuarios(busquedaRequest: BusquedaUsuarioRequest) {
        // this.spinner.show();
        this.usuarioService.listarUsuariosTabla(busquedaRequest).pipe(

        ).subscribe(resultadoBusqueda => {
          console.log('usuarios' , resultadoBusqueda)
          this.total = resultadoBusqueda.total;
          this.usuarioSubject.next(resultadoBusqueda.usuarios)
        });

    }

    connect(collectionViewer: CollectionViewer): Observable<any[] | readonly any[]> {
        return this.usuarioSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.usuarioSubject.complete();
        // this.spinner.hide();
    }

}
