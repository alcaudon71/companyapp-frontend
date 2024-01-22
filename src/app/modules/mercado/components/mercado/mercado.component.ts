import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MercadoService } from 'src/app/modules/shared/services/mercado.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { MercadoElement } from './mercado-element';
import { NuevoMercadoComponent } from '../nuevo-mercado/nuevo-mercado.component';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'compa-mercado',
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.css']
})
export class MercadoComponent implements OnInit {

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
   * Apertura de un Dialog Modal cuando se pulsa el boton de Agregar 
   */
  openDialog() {
    console.log("Mercado - openDialog ");

    // Se abre un Dialog que contiene en su interior el componente NewMercadoComponent
    const dialogRef = this.dialog.open(NuevoMercadoComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Mercado Agregado", "Exito");
        // Recargamos la tabla de mercados
        this.obtenerMercados();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar mercado", "Error");
      }

    });
  }

  /**
   * Modificar registro 
   * @param id
   * @param clave 
   * @param descripcion 
   * @param sector
   * @param pais
   */
  onEdit (id1: number , clave1: string, descripcion1: string, sector1: string, pais1: string): void {
    console.log("Mercado - onEdit ");

    // Se abre un Dialog que contiene en su interior el componente NuevoMercadoComponent
    const dialogRef = this.dialog.open(NuevoMercadoComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {id: id1, clave: clave1, descripcion: descripcion1, sector: sector1, pais: pais1},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Mercado actualizado", "Exito");
        // Recargamos la tabla de categorias
        this.obtenerMercados();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar mercado", "Error");
      }

    });
  }

  /**
   * Eliminar Registro 
   * @param id
   */
  onDelete (id1: number): void  {
    // Se abre un Dialog que contiene en su interior el componente ventana modal de Confirmacion
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {id: id1, module: "mercado"}, // se indica el tipo de objeto a eliminar (category)
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Mercado eliminado", "Exito");
        // Recargamos la tabla de categorias
        this.obtenerMercados();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar mercado", "Error");
      }

    });
  }

  /**
   * Buscar registros que empiecen por un determinado literal 
   * @param literal 
   * @returns 
   */
  buscar( literal: string) {

    console.log("buscar por literal: " + literal);

    // Si el usuario no introduce literal, recuperamos el total de registros
    if (literal.length == 0) {
      return this.obtenerMercados();
    }

    // Trabajamos con el literal introducido por el usuario en la casilla de busqueda
    let obsMercadoByName = this.mercadoService.getMercadoByClave(literal);

    obsMercadoByName.subscribe({
      next: (resp:any) => {
        // Cargar el datasource con la info recibida en el item del observable
        this.procesarMercadosResponse(resp);
      }
      ,
      error: (error:any) => {}
    });

  }

  /**
   * Abrir mensaje en una ventana
   */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {

    return this.snackBar.open(message, action, {duration: 2000});

  }

  /**
   * Exportar lista de registros a fichero excel xlsx 
   */
  exportExcel(): void {

    let obsExportarMercados: Observable<Object> = this.mercadoService.exportar();

    obsExportarMercados.subscribe({
      next: (item: any) => {
        // Definimos el fichero
        let file = new Blob([item], 
                    {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})   // formato excel xml 2007
        let fileUrl = URL.createObjectURL(file);

        // Creamos el anchor
        var anchor = document.createElement("a");
        anchor.download = "mercados.xlsx";   // nombre con el que se va a almacenar el fichero xlsx
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar("Archivo exportado correctamente", "Exitosa");
      },
      error: (error: any) => {
        this.openSnackBar("No se pudo exportar el archivo", "Error");
      }
    });

  }

}
