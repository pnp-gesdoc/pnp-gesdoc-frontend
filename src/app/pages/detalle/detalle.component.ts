import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentoService} from '../../services/documento.service';
import {DetalleDocumento} from '../../models/detalleDocumento.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {Usuario} from '../../models/usuario.model';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  id: string;
  detalleDocumento: DetalleDocumento;
  usuarios: Usuario[];
  mostrar = true;

  displayedColumns: string[] = ['item', 'dni', 'nombres', 'apellidos', 'correo'];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private documentoService: DocumentoService,
              private configService: ConfigService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      if (this.id) {
        this.fnVerDetalle(this.id);
      }
    });

  }

  fnVerDetalle(id: string) {
    this.spinner.show();
    this.documentoService.getDocumento(id).subscribe(data => {
      this.detalleDocumento = data;
      if(this.detalleDocumento.archivo){
        this.detalleDocumento.extension = this.detalleDocumento.archivo.split('.').pop();
      }
      this.usuarios = this.detalleDocumento.usuarios;
    }, error => {
      this.spinner.hide();
      this.mostrar = false;
    }, () => {
      this.spinner.hide();
    });
  }

  doVerArchivo(id : string) {
    this.documentoService.descargarArchivo(id).subscribe(res => {
      this.configService.getVisorArchivo(res.body)
    });
  }

  doGenerateAndDownload(id: string) {
    const data = this.documentoService.obtenerLinkArchivo(id);
    const link = document.createElement('a');
    link.href = data;
    link.download = this.detalleDocumento.archivo;
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    setTimeout(function() {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  cerrar() {
    this.configService.link('bandeja');
  }

}
