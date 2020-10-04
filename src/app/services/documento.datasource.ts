import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import { DetalleDocumento } from '../models/detalleDocumento.model';
import { DocumentoService } from './documento.service';
import { BusquedaRequestDto } from '../models/busquedaRequest.model';
import { ResultadoBusquedaDocumento } from '../models/resultadoBusquedaDocumento.model';

export class DocumentoDataSource implements DataSource<DetalleDocumento> {

    private detalleDocumentoSubject = new BehaviorSubject<ResultadoBusquedaDocumento[]>([]);
    public total: number;

    constructor(private documentoService: DocumentoService,
                private spinner: NgxSpinnerService) {

    }

    cargarDetalleDocumentos(busquedaRequest: BusquedaRequestDto) {
        this.spinner.show();
        this.documentoService.listarDocumentosTabla(busquedaRequest).pipe(
            finalize(() => this.spinner.hide()),
        ).subscribe(resultadoBusqueda => {
          this.total = resultadoBusqueda.total;
          this.detalleDocumentoSubject.next(resultadoBusqueda.documentos)
        });

    }

    connect(collectionViewer: CollectionViewer): Observable<any[] | readonly any[]> {
        console.log('conectando listado de documentos');
        return this.detalleDocumentoSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.detalleDocumentoSubject.complete();
        this.spinner.hide();
    }

}
