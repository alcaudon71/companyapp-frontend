import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MercadoElement } from 'src/app/modules/mercado/components/mercado/mercado-element';
import { EmpresaService } from 'src/app/modules/shared/services/empresa.service';
import { MercadoService } from 'src/app/modules/shared/services/mercado.service';

@Component({
  selector: 'compa-nueva-empresa',
  templateUrl: './nueva-empresa.component.html',
  styleUrls: ['./nueva-empresa.component.css']
})
export class NuevaEmpresaComponent implements OnInit {

  // Atributo para indicar si el Dialog va a ser Crear Empresa o Actualizar Empresa
  estadoFormulario: string = "";

  mercados: MercadoElement[] = [];

  selectedFile: any;
  nombreImg: string = "";

  // Objeto para trabajar con el Formulario de la ventana
  // ---> se utiliza en el form del html 
  public empresaForm!: FormGroup;

  // Inyeccion de dependencias
  private fb = inject(FormBuilder);
  private mercadoService = inject(MercadoService);
  private empresaService = inject(EmpresaService);
  //private dialogRef = inject(MatDialogRef<NewProductComponent>);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog
    
  ngOnInit(): void {

    console.log("NuevaEmpresaComponent - ngOnInit");
    console.log("data: ", this.data);
    console.log("clave: ", this.data.clave);

    // Construccion del formulario con la estructura indicada
    // Inicialmente, al crear mostramos el formulario con los campos vacios 
    this.empresaForm = this.fb.group({
      clave:       ['', Validators.required],   // valor por defecto y validacion requerida
      descripcion: ['', Validators.required],
      capital:     ['', Validators.required],
      mercado:     ['', Validators.required],
      imagen:      ['', Validators.required]
    });

    //console.log("empresaForm: ", this.empresaForm);

    // Obtenemos todas los mercados disponibles para el combo de Mercados del formulario de Nueva Empresa
    this.obtenerMercados();

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
   * Obtencion de todos los mercados disponibles para el combo de Mercados del formulario de Nueva Empresa
   * --> Cargamos la lista en el atributo this.categories
   */
  obtenerMercados() : void {

    this.mercadoService.obtenerMercados().subscribe({
      next: (data:any) => {
        // Cargamos los objetos de tipo MercadoElement
        this.mercados = data.mercadoResponse.mercado;
      },
      error: (error:any) => {
        console.log("Error al obtener la lista de mercados");
      }

    })
  }

  /**
   * Actualizar formulario con los datos actuales del registro
   * --> El campo Foto se deja en blanco y no se muestra la imagen actual
   * @param data  Datos actuales del registro
   */
  updateForm (data : any): void {

    console.log("NuevaEmpresa - updateForm");
  
    // Construccion del formulario con los datos recibidos
    // Asi, cuando se abra el formulario, se mostraran los datos actuales del registro
    this.empresaForm = this.fb.group({
      clave:     [data.clave, Validators.required],   // valor por defecto y validacion requerida
      descripcion:    [data.descripcion, Validators.required],
      capital:  [data.capital, Validators.required],
      mercado: [data.mercado.id, Validators.required],
      imagen:  ['', Validators.required]
    });
  
  }

  /**
   * Confirmar creacion de nueva Empresa 
   * Se invoca desde el boton Guardar de la ventana Dialog de nuevo registro
   */
  onSave(): void {
    console.log("NuevaEmpresa - onSave -data: ", this.data );

    let dataJson = {
      clave: this.empresaForm.get('clave')?.value,   // esto obtiene "value" si el campo no es null
      descripcion: this.empresaForm.get('descripcion')?.value,
      capital: this.empresaForm.get('capital')?.value,
      mercado: this.empresaForm.get('mercado')?.value,
      imagen: this.selectedFile 
    }

    console.log("dataJson.clave: " + dataJson.clave );
    console.log("dataJson.descripcion: " + dataJson.descripcion );
    console.log("dataJson.capital: " + dataJson.capital);
    console.log("dataJson.mercado: " + dataJson.mercado);
    console.log("dataJson.imagen: " + dataJson.imagen);

    // Formulario de datos que hay que enviar al servicio
    const uploadImageData = new FormData();

    // El formulario se debe crear con los nombres especificados en el webservice del Servidor
    // --> imagen, clave, descripcion, capital y mercadoId
    uploadImageData.append('imagen', dataJson.imagen, dataJson.imagen.name);
    uploadImageData.append('clave', dataJson.clave);
    uploadImageData.append('descripcion', dataJson.descripcion);
    uploadImageData.append('capital', dataJson.capital);
    uploadImageData.append('mercadoId', dataJson.mercado);


    // Si el Dialog no tenia datos de partida --> funcion crear
    // Si el Dialog ya tenia datos al principio --> funcion modificar
    if (this.data.id != null) {
      // Funcionalidad Actualizar empresa
      let obsEmpresaUpdate: Observable<Object> = this.empresaService.actualizarEmpresa(uploadImageData, this.data.id);

      obsEmpresaUpdate.subscribe({
        next: (item: any) => {
          console.log("Modificar empresa actual: " + item);

          // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "1"
          this.dialogRef.close(1);
        },
        error: (error:any) => {
          // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "2"
          this.dialogRef.close(2);
        }
      })

    } else {
      // Funcionalidad Crear empresa

      //let obsProductSave: Observable<Object> = this.productService.saveProduct(dataJson);
      let obsEmpresaSave: Observable<Object> = this.empresaService.crearEmpresa(uploadImageData);

      // Nos suscribimos a la accion saveEmpresa del servicio para obtener los items producidos
      obsEmpresaSave.subscribe({
        next: (item: any) => {
          console.log("crear nueva empresa: " + item);

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
    console.log("cancelar creacion de nueva empresa");
    this.dialogRef.close(3);
  }

  /**
   * Tratamiento de la imagen subida por el usuario
   * @param event   Evento con la imagen 
   */
  onFileChanged(event: any): void {
    // Extraemos el fichero del evento
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile);

    // Extraemos el nombre del fichero
    this.nombreImg = event.target.files[0].name;
  }

}
