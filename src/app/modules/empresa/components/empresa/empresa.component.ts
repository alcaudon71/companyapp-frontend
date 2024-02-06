import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { EmpresaService } from 'src/app/modules/shared/services/empresa.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { EmpresaElement } from './empresa-element';
import { NuevaEmpresaComponent } from '../nueva-empresa/nueva-empresa.component';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'compa-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  // Inyecciones de dependencias
  private empresaService = inject(EmpresaService);
  public  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private util = inject(UtilService);

  isAdmin: any;

  // Columnas que van a ser mostradas en la tabla de la consulta 
  displayedColumns: string[] = ['id', 'clave', 'descripcion', 'capital', 'mercado', 'imagen', 'actions'];
  // Datasource para transferir datos
  dataSource = new MatTableDataSource<EmpresaElement>();
 
  // Atributo del paginador
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor() {}


  ngOnInit(): void {
    console.log("EmpresaComponent - ngOnInit");

    this.obtenerEmpresas();

    // Obtencion de roles keycloak del usuario
    //let roles: string[] = this.util.getRoles();

    //console.log("roles: " + roles);
   
    // Verificamos si el usuario tiene asignado el role Admin
    // --> Esta variable se utilizara en el HTML para visualizar u ocultar componentes
    //this.isAdmin = this.util.isAdmin();
    this.isAdmin = true;

  }

  /**
   * Obtencion de todas las empresas de la aplicacion
   */
  obtenerEmpresas(): void {
    let obsEmpresas : Observable<Object> = this.empresaService.obtenerEmpresas();

    // Nos suscribimos al observable para recibir sus items 
    obsEmpresas.subscribe({
      next: (data:any) => {
        console.log("respuesta de empresas: ", data);
        // Procesamos el item de repuesta
        this.procesarEmpresaResponse(data);
      },
      error: (error:any) => {
        console.log("error en empresas: ", error);
      }
    })
  }

  procesarEmpresaResponse (resp:any) {
    const dataEmpresa: EmpresaElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listCEmpresa = resp.empresaResponse.empresas;

      // Vamos recuperando los datos de la lista
      // Transformamos los campos categoria e imagen 
      listCEmpresa.forEach( (element: EmpresaElement) => {
        //element.mercado = element.mercado.clave;
        // La imagen viene en formato base64 del webservice del servidor 
        // Le tenemos que añadir el siguiente prefijo para que sea legible por Angular
        element.imagen = 'data:image/jpeg;base64,' + element.imagen;
        dataEmpresa.push(element);
        
      });

      // Establecemos el datasource
      this.dataSource = new MatTableDataSource<EmpresaElement>(dataEmpresa);
      this.dataSource.paginator = this.paginator;

    }

  }

  /**
   * Apetura de Dialog para mostra el componente de Nuevo Registro
   */
  openDialog(): void {
    console.log("Empresa - openDialog ");

    // Se abre un Dialog que contiene en su interior el componente NuevaEmpresaComponent
    const dialogRef = this.dialog.open(NuevaEmpresaComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Empresa Agregada", "Exito");
        // Recargamos la tabla de registros
        this.obtenerEmpresas();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar empresa", "Error");
      }

    });
  }
  
  /**
   * Abrir mensaje en una ventana
   * --- Esto podria estar en el modulo shared --- 
   */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {

      return this.snackBar.open(message, action, {duration: 2000});
  
  }

  /**
   * Modificar Empresa
   * @param id1           Id de la empresa
   * @param clave1        Nueva clave de la empresa
   * @param descripcion1  Nueva descripcion de la empresa
   * @param capital1      Nueva capitalizacion de la empresa
   * @param mercado1      Nuevo mercado de la empresa 
   */
  editar(id1: number, clave1: string, descripcion1: string, capital1: number, mercado1: any): void {

    console.log("Empresa - editar ");

    // Se abre un Dialog que contiene en su interior el componente NuevaEmpresaComponent
    const dialogRef = this.dialog.open(NuevaEmpresaComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {id: id1, clave: clave1, descripcion: descripcion1, capital: capital1, mercado: mercado1},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Empresa Modificada", "Exito");
        // Recargamos la tabla de registros
        this.obtenerEmpresas();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al modificar empresa", "Error");
      }

    });

  }

  /**
   * Eliminar empresa
   * @param id1   Id de la empresa a eliminar
   */
  eliminar (id1: any): void {

    console.log("Empresa - eliminar ");

    // Se abre un Dialog que contiene en su interior el componente ConfirmComponent
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {id: id1, module: "empresa"}, // se indica el tipo de objeto a eliminar (empresa)
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Empresa Eliminada", "Exito");
        // Recargamos la tabla de registros
        this.obtenerEmpresas();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar empresa", "Error");
      }

    });

  }

  /**
   * Buscar Empresas que coinciden con la cadena proporcionada por el usuario
   * @param cadena  Cadena de caracteres para lanzar la busqueda de empresas
   * @returns 
   */
  buscar(cadena: any) {

    if (cadena.length == 0) {
      // Si no se busca ninguna cadena, recargamos todos los registros
      return this.obtenerEmpresas();
    
    }

    // Creamos el observable
    let obsEmpresaByName = this.empresaService.obtenerEmpresaPorDescripcion(cadena);

    // Nos suscribimos al observable
    obsEmpresaByName.subscribe({
      next: (item: any) => {
        this.procesarEmpresaResponse(item);
      },
      error: (error: any) => {

      }
    })


  }

  /**
   * Exportar lista de empresas a fichero excel xlsx 
   */
  exportExcel(): void {

    let obsExportEmpresas: Observable<Object> = this.empresaService.exportar();

    obsExportEmpresas.subscribe({
      next: (item: any) => {
        // Definimos el fichero
        let file = new Blob([item], 
                    {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})   // formato excel xml 2007
        let fileUrl = URL.createObjectURL(file);

        // Creamos el anchor
        var anchor = document.createElement("a");
        anchor.download = "empresas.xlsx";   // nombre con el que se va a almacenar el fichero xlsx
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
