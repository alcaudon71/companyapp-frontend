import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MercadoService } from '../../services/mercado.service';
import { Observable } from 'rxjs';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'compa-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  // Inyecciones
  public dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog 
  public mercadoService = inject(MercadoService);
  public empresaService = inject(EmpresaService); // EmpresaService

  /**
   * Cancelar Accion
   */
  onNotClick(): void {
    // Cerramos ventana
    this.dialogRef.close();
  }

  /**
   * Confirmar Accion Eliminar
   * --> Permite eliminar cualquier tipo de objeto de la aplicacion
   * --> Mercado, Empresa
   */
  onDelete() {
    console.log("ConfirmComponent - onDelete - data: ", this.data);

    // Si en el Dialog hemos recibido algun id de objeto
    if (this.data != null) {

      // Tratamiento para borrado de objeto Mercado
      if (this.data.module == "mercado") {

        let obsMercadoDelete: Observable<Object> = this.mercadoService.eliminarMercado(this.data.id);

        obsMercadoDelete.subscribe({
          next: (item:any) => {
            this.dialogRef.close(1);   // retorno correcto "1"
          }
          ,
          error: (error:any) => {
            this.dialogRef.close(2);   // retorno error "2"
          }

        });

      } else if (this.data.module == "empresa") {
          // Tratamiento para borrado de objeto Empresa
          console.log("Tratamiento para borrado de objeto Empresa");

          let obsEmpresaDelete: Observable<Object> = this.empresaService.eliminarEmpresa(this.data.id);

          obsEmpresaDelete.subscribe({
            next: (item:any) => {
              this.dialogRef.close(1);   // retorno correcto "1"
            }
            ,
            error: (error:any) => {
              this.dialogRef.close(2);   // retorno error "2"
            }
  
          });

      }

    } else {
      // No hemos recibido id en el Dialog 
      // cerramos y devolvemos retorno "2"
      this.dialogRef.close(2);
    }
  }
  
}
