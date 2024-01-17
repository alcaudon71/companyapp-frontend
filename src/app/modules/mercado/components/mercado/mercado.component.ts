import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MercadoService } from 'src/app/modules/shared/services/mercado.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { MercadoElement } from './mercado-element';

@Component({
  selector: 'compa-mercado',
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.css']
})
export class MercadoComponent implements OnInit {
onEdit(arg0: any,arg1: any,arg2: any,arg3: any,arg4: any) {
throw new Error('Method not implemented.');
}
onDelete(arg0: any) {
throw new Error('Method not implemented.');
}
exportExcel() {
throw new Error('Method not implemented.');
}
openCategoryDialog() {
throw new Error('Method not implemented.');
}
buscar(arg0: string) {
console.log('Method not implemented.');
}

  // Inyectamos el Servicio de mercados y los elementos de Angular Material 
  private mercadoService = inject(MercadoService);
  public  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private util = inject(UtilService);

  isAdmin: any;

  // Columnas que van a ser mostradas en la tabla de la consulta 
  displayedColumns: string[] = ['id', 'clave', 'descripcion', 'sector', 'pais', 'actions'];
  // Datasource para transferir datos
  dataSource = new MatTableDataSource<MercadoElement>();

  // Atributo del paginador
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    console.log("MercadoComponent - ngOnInit");
    this.obtenerMercados();

    // Obtencion de roles keycloak del usuario
    //let roles: string[] = this.util.getRoles();

    //console.log("roles: " + roles);
    
    // Verificamos si el usuario tiene asignado el role Admin
    // --> Esta variable se utilizara en el HTML para visualizar u ocultar componentes
    //this.isAdmin = this.util.isAdmin();

  }

  // obtencion de mercados
  obtenerMercados(): void {

    console.log("Obtener mercados");

    let obsMercados: Observable<Object> = this.mercadoService.obtenerMercados();

    // Suscripcion al observable del servicio 
    // Vamos recibiendo items en formato json
    // Establecemos el metodo que va a realizar el tratamiento del item recibido y del posible error
    obsMercados.subscribe({ 
      next: (data: any) => {
        console.log("respuesta observable: ", data);
        this.procesarMercadosResponse(data);
      },
      error: (error: any) => {
        console.log("error: ", error);
      }
    });

  }

  // Cargar el datasource con la info recibida en el item del observable
  procesarMercadosResponse (resp: any) {
    const dataMercado: MercadoElement[] = [];

    // Si el codigo devuelto por el servicio del backend es correcto ("00")
    if (resp.metadata[0].code == "00") {
      let listMercado = resp.mercadoResponse.mercado;

      // Cargamos en la lista todos los elementos que hayan venido en el json del observable
      listMercado.forEach( (element: MercadoElement) => {
        dataMercado.push(element);
      } );

      // Cargamos el listado de elementos en el datasource que se mostrará en el html
      this.dataSource = new MatTableDataSource<MercadoElement>(dataMercado);

      // Paginacion
      this.dataSource.paginator = this.paginator;

    }

  }  

  /**
   * Abrir mensaje en una ventana
   */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {

    return this.snackBar.open(message, action, {duration: 2000});

  }
  
}
