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

}
