import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// http://localhost:8080/universo/company/mercados
const base_url = "http://localhost:8080/universo/company";

@Injectable({
  providedIn: 'root'
})
export class MercadoService {

  // Inyecciones de dependencias 
  // Inyeccion para permitir conexion con servicios HTTP
  private http = inject(HttpClient);

  constructor() { }

  /**
   *  Obtencion de listado de mercados
   *  @returns Observable con el listado de mercados
   */
  obtenerMercados(): Observable<Object> {

    const endpoint = `${base_url}/mercados`;

    let retorno: Observable<Object> = this.http.get(endpoint);

    return retorno;

  }

  /**
   * Crear registro
   * @param body JSON con los datos del registro
   * @returns Observable
   */
  crearMercado(body: any): Observable<Object> {
    const endpoint = `${base_url}/mercados`;

    let retorno: Observable<Object> = this.http.post(endpoint, body);

    return retorno;

  }

  /**
   * Modificar registro
   * endpoint --> http://localhost:8080/universo/company/mercados/4
   * @param body JSON con datos del registro
   * @param id   Id del registro que debe ser modificado
   * @returns Observable
   */
  modificarMercado(body: any, id: any): Observable<Object> {
    const endpoint = `${base_url}/mercados/${id}`;  

    let retorno: Observable<Object> = this.http.put(endpoint, body);   // put --> actualizar registro

    return retorno;

  }

  /**
   * Eliminar registro
   * endpoint --> http://localhost:8080/universo/company/mercados/4
   * @param id   Id del registro que debe ser eliminado
   * @returns Observable
   */
  eliminarMercado(id: any): Observable<Object> {
    const endpoint = `${base_url}/mercados/${id}`;  

    let retorno: Observable<Object> = this.http.delete(endpoint);   // delete --> eliminar registro

    return retorno;

  }

  /**
   * Buscar mercado
   * endpoint --> http://localhost:8080/universo/company/mercados/1
   * @param id   Id del mercado que debe ser modificado
   * @returns Observable
   */
  getMercadoById(id: any): Observable<Object> {
    const endpoint = `${base_url}/mercados/${id}`;  

    let retorno: Observable<Object> = this.http.get(endpoint);   // get --> obtener registro

    return retorno;

  }

  /**
   * Buscar por clave de registro
   * @param clave  Clave del registro que debe ser buscado
   * @returns Observable<Object>  Observable de la invocacion del servicio
   */
  getMercadoByClave (clave: any): Observable<Object> {

    const endpoint = `${base_url}/mercados/filtro/${clave}`;   // endpoint del webservice del servidor que busca cadena

    console.log("Invocacion al webservice de filterByClave");
    console.log("endpoint: " + endpoint);
    console.log("clave: " + clave);

    return this.http.get(endpoint);
    
  }

  /**
   * Exportar lista de registros a fichero excel
   * @returns Observable
   */
  exportar(): Observable<Object> {
    const endpoint = `${base_url}/mercados/export/excel`;  

    let retorno: Observable<Object> = this.http.get(endpoint, {
      responseType: 'blob'   // blob --> vamos a recibir una respuesta con un fichero tipo blob
    });   

    return retorno;

  }

}
