import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './modules/app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from './modules/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Page404Component } from './shared/page404/page404.component';
import { HomeComponent } from './shared/home/home.component';
import { ValidatorEqualDirective } from './directives/validator-equal.directive';
import { ConfigService } from './services/config.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ErrorInterceptor } from './helpers/error.interceptor';
import {NgxSpinnerModule} from 'ngx-spinner';
import { BandejaComponent } from './core/bandeja/bandeja.component';
import { DetalleComponent } from './core/detalle/detalle.component';
import { RegistroComponent } from './core/registro/registro.component';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import { VisorArchivoComponent } from './core/visor-archivo/visor-archivo.component';
import { UsuariosComponent } from './core/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    HomeComponent,
    ValidatorEqualDirective,
    BandejaComponent,
    DetalleComponent,
    RegistroComponent,
    VisorArchivoComponent,
    UsuariosComponent,
  ],
  entryComponents: [
    VisorArchivoComponent,
    UsuariosComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppMaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(AppRoutes),
        PdfViewerModule,
        NgxSpinnerModule,
        MaterialFileInputModule
    ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/gdpnp' },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ConfigService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
