import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-visor-archivo',
  templateUrl: './visor-archivo.component.html',
  styleUrls: ['./visor-archivo.component.scss']
})
export class VisorArchivoComponent implements OnInit {

  public urlPDF: string;
  public pdfBlob: Blob;

  constructor(public dialog: MatDialogRef<VisorArchivoComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog) { }

  ngOnInit() {
    this.doGenerateUrlPDF(this.dataDialog.pdfBlob);
  }

  doGenerateUrlPDF(pdfBlob) {
    // const bytes = atob(base64); // BASE64 TO BYTES
    // const byteNumbers = new Array(bytes.length);
    // for (let i = 0; i < bytes.length; i++) {
    //   byteNumbers[i] = bytes.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers); // BYTES ARRAY
    // const pdf = new Blob([byteArray], {type: 'application/pdf'});
    this.pdfBlob = pdfBlob;
    this.urlPDF = URL.createObjectURL(pdfBlob);
  }

}
