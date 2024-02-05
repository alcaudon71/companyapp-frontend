import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MercadoModule } from '../mercado/mercado.module';
import { NuevaEmpresaComponent } from './components/nueva-empresa/nueva-empresa.component';
import { MaterialModule } from '../shared/material.module';
import { EmpresaComponent } from './components/empresa/empresa.component';




@NgModule({
  declarations: [
    EmpresaComponent,
    NuevaEmpresaComponent
    //NuevaEmpresaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    /* FlexLayoutModule, */ /* modulo obsoleto */
    FormsModule,
    ReactiveFormsModule,
    MercadoModule
  ]
})
export class EmpresaModule { }
