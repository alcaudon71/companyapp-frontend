import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { MercadoModule } from '../mercado/mercado.module';


// Este es el modulo principal de la aplicacion, aqui llegamos redirigidos desde el app-root
@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule, 
    SharedModule,
    MercadoModule,
    //EmpresaModule,
    MaterialModule
  ]
})
export class DashboardModule { }
