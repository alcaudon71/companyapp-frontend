import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MercadoComponent } from './components/mercado/mercado.component';
import { NuevoMercadoComponent } from './components/nuevo-mercado/nuevo-mercado.component';



@NgModule({
  declarations: [
    MercadoComponent,
    NuevoMercadoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    /* FlexLayoutModule, */ /* modulo obsoleto */
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MercadoModule { }
