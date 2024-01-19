import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MercadoService } from 'src/app/modules/shared/services/mercado.service';

@Component({
  selector: 'compa-nuevo-mercado',
  templateUrl: './nuevo-mercado.component.html',
  styleUrls: ['./nuevo-mercado.component.css']
})
export class NuevoMercadoComponent implements OnInit {

  // Atributo para indicar si el Dialog va a ser Crear Mercado o Actualizar Mercado
  estadoFormulario: string = "";

  // Objeto para trabajar con el Formulario de la ventana
  // ---> se utiliza en el form del html 
  public mercadoForm!: FormGroup;

  // Inyeccion de dependencias
  private fb = inject(FormBuilder);
  private mercadoService = inject(MercadoService);
  //private dialogRef = inject(MatDialogRef<NewCategoryComponent>);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog 

  ngOnInit(): void {
    console.log("NuevoMercadoComponent - ngOnInit");
    console.log("data: ", this.data);
    console.log("clave: ", this.data.clave);

    // Construccion del formulario con la estructura indicada
    // Inicialmente, al crear mostramos el formulario con los campos vacios 
    this.mercadoForm = this.fb.group({
      clave: ['', Validators.required],   // valor por defecto y validacion requerida
      descripcion: ['', Validators.required],
      sector: ['', Validators.required],
      pais: ['', Validators.required]
    });

    this.estadoFormulario = "Agregar";

    // Si el Dialog viene con datos, es que hemos entrado en la ventana Modificar y no en la ventana Crear
    // Los datos que vienen corresponden a la info actual que tiene el registro
    // Por tanto, la ventana Dialog se abrira mostrando en el formulario los datos actuales
    if (this.data.clave != null) {
      console.log(" *** Funcionalidad Modificar *** ");
      this.updateForm (this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      console.log(" *** Funcionalidad Agregar *** ");
    }

  }

  /**
   * Confirmar creacion de nuevo registro 
   * Se invoca desde el boton Guardar de la ventana Dialog de nuevo registro
   */
  onSave(): void {
    console.log("NuevoMercado - onSave -data: ", this.data );

    let dataJson = {
      clave: this.mercadoForm.get('clave')?.value,   // esto obtiene "value" si el campo no es null
      descripcion: this.mercadoForm.get('descripcion')?.value,
      sector: this.mercadoForm.get('sector')?.value,
      pais: this.mercadoForm.get('pais')?.value
    }

    // Si el Dialog no tenia datos de partida --> funcion crear
    // Si el Dialog ya tenia datos al principio --> funcion modificar
    if (this.data.id != null) {
      // Funcionalidad Actualizar registro

      let obsMercadoUpdate: Observable<Object> = this.mercadoService.modificarMercado(dataJson, this.data.id);

      obsMercadoUpdate.subscribe({
        next: (item: any) => {
          console.log("Modificar registro actual: " + item);

          // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "1"
          this.dialogRef.close(1);
        },
        error: (error:any) => {
          // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "2"
          this.dialogRef.close(2);
        }
      })

    } else {
      // Funcionalidad Crear registro

      let obsMercadoSave: Observable<Object> = this.mercadoService.crearMercado(dataJson);

      // Nos suscribimos a la accion Save del servicio para obtener los items producidos
      obsMercadoSave.subscribe({
        next: (item: any) => {
          console.log("crear nuevo registro: " + item);

          // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "1"
          this.dialogRef.close(1);
        },
        error: (error: any) => {
          // Ejecucion con error: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "2"
          this.dialogRef.close(2);
        }
      });

    }

  }

  /**
   * Cancelar creacion de nuevo registro
   */
  onCancel(): void {
    console.log("cancelar creacion de nuevo mercado");
    this.dialogRef.close(3);
  }

  /**
   * Actualizar formulario con los datos actuales del registro
   * @param data 
   */
  updateForm (data:any) {
    console.log("NuevoMercado - updateForm");

    // Construccion del formulario con los datos recibidos
    // Asi, cuando se abra el formulario, se mostraran los datos actuales del registro
    this.mercadoForm = this.fb.group({
      clave: [data.clave, Validators.required],   // valor por defecto y validacion requerida
      descripcion: [data.descripcion, Validators.required],
      sector: [data.sector, Validators.required],
      pais: [data.pais, Validators.required]
    });

  }

}
