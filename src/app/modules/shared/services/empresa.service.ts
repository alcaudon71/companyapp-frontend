import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

const base_url = "http://localhost:8080/universo/company";   // ruta de los servicios rest de la app servidor

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  // Inyecciones
  private http = inject(HttpClient);

  constructor() { }

  /**
   * Obtencion de todas las empresas de la aplicacion
   * @return  Observable  Devuelve un observable con el item con todos las empresas de la aplicacion
   */
  obtenerEmpresas(): Observable<Object> {
    const endpoint = `${base_url}/empresas`;   // endpoint del webservice del servidor que devuelve todas las empresas

    let obsEmpresas: Observable<Object> = this.http.get(endpoint);

    return obsEmpresas;

  }

  /**
   * Invoca al webservice del Servidor que sirve para almacenar Empresa
   * @param   body        Datos de la empresa a almacenar
   * @returns Observable  Observable con la info de la respuesta de la invocacion al webservice
   */
  crearEmpresa(body: any): Observable<Object> {
    const endpoint = `${base_url}/empresas`;   // endpoint del webservice del servidor

    console.log("Invocacion al webservice de saveEmpresa");

    return this.http.post(endpoint, body);

  }

  /**
   * Invoca al webservice del Servidor que sirve para actualizar Empresa
   * @param body 
   * @param id 
   * @returns 
   */
  actualizarEmpresa(body: any, id: any): Observable<Object> {
    const endpoint = `${base_url}/empresas/${id}`;   // endpoint del webservice del servidor 

    console.log("Invocacion al webservice de updateEmpresa");
    console.log("endpoint: " + endpoint);
    console.log("body: " + body);

    return this.http.put(endpoint, body);
  }

  /**
   * Eliminar Empresa
   * @param id  Id de la empresa a eliminar
   * @returns Observable<Object>  Observable de la invocacion del servicio Eliminar Empresa
   */
  eliminarEmpresa (id: any): Observable<Object> {

    const endpoint = `${base_url}/empresas/${id}`;   // endpoint del webservice del servidor que elimina registro

    console.log("Invocacion al webservice de deleteById de Empresa");
    console.log("endpoint: " + endpoint);
    console.log("id: " + id);

    return this.http.delete(endpoint);

  }

  /**
   * Buscar por nombre de Empresa
   * @param name  Nombre de la empresa que debe ser buscada
   * @returns Observable<Object>  Observable de la invocacion del servicio
   */
  obtenerEmpresaPorDescripcion (cadena: any): Observable<Object> {

    const endpoint = `${base_url}/empresa/filter/${cadena}`;   // endpoint del webservice del servidor que busca cadena

    console.log("Invocacion al webservice de filterByDescription");
    console.log("endpoint: " + endpoint);
    console.log("name: " + name);

    return this.http.get(endpoint);
    
  }

  /**
   * Exportar lista de registros a fichero excel
   * @returns Observable
   */
  exportar(): Observable<Object> {
    const endpoint = `${base_url}/empresas/export/excel`;  
  
    let retorno: Observable<Object> = this.http.get(endpoint, {
      responseType: 'blob'   // blob --> vamos a recibir una respuesta con un fichero tipo blob
    });   
  
    return retorno;
  
  }

}
