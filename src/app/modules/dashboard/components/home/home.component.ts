import { Component, OnInit, inject } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { EmpresaElement } from 'src/app/modules/empresa/components/empresa/empresa-element';
import { EmpresaService } from 'src/app/modules/shared/services/empresa.service';

@Component({
  selector: 'compa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Inyecciones de dependencias
  private empresaService = inject(EmpresaService);
  
  // Graficos de Barras y Donut de la aplicacion
  // Mostrara las estadisticas de empresas
  chartBar: any;
  chartDoughnut: any;

  ngOnInit(): void {
    console.log("HomeComponent - ngOnInit");
      // Cargamos el barchart con los datos de empresas
      this.obtenerEmpresas();
  }

  /**
   * Obtencion de todas las empresas de la aplicacion
   */
  obtenerEmpresas(): void {
    let obsEmpresas : Observable<Object> = this.empresaService.obtenerEmpresas();

    // Nos suscribimos al observable de empresas para recibir sus items 
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

  /**
   * Procesar respuesta obtenida del webservice de Empresas
   * @param resp  Respuesta del webservice de Empresas
   */
  procesarEmpresaResponse (resp:any) {
  
    // Arrays con la lista de empresas y la lista de cantidades asociada
    const nombreEmpresa: string[] = [];
    const capital: number[] = [];

    if (resp.metadata[0].code == "00") {
        let listCEmpresa = resp.empresaResponse.empresas;
  
        // Vamos recuperando los datos de la lista
        // Almacenaremos nombre de la empresa y su capitalizacion bursatil
        listCEmpresa.forEach( (element: EmpresaElement) => { 
          //element.category = element.category.name;
          // Guardamos nombre y capital en los arrays correspondientes
          nombreEmpresa.push(element.descripcion);
          capital.push(element.capital);
          
        });
        
        // Configuracion del grafico de tipo barchart
        const name: any = 'canvas-bar';
        const config: any = {
          type: 'bar',
          data: {
            labels: nombreEmpresa,   // nombres de las empresas
            datasets: [
              {label: 'Empresas', data: capital}   // capitalizacion de cada empresa
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          },
        };

        // Generamos el grafico de barras con la configuracion anterior
        this.chartBar = new Chart(name, config);
 
        // Configuracion del grafico de tipo doughnut
        const name2: any = 'canvas-doughnut';
        const config2: any = {
          type: 'doughnut',
          data: {
            labels: nombreEmpresa,   // nombres de las empresas
            datasets: [
              {label: 'Productos', data: capital}   // cantidades de las empresas
            ]
          }
        };

        // Generamos el grafico de doughnut con la configuracion anterior
        this.chartDoughnut = new Chart(name2, config2);

    }
  
  }

}
