import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'compa-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  // Inyecciones de dependencias
  private keycloakService = inject(KeycloakService);

  mobileQuery: MediaQueryList;  // obtener Medios disponibles para el dispositivo
  username: any;
  shouldRun = true;

  menuNav = [
    {name: "Home", route: "home", icon: "home"},
    {name: "Mercados", route: "mercado", icon: "shopping_cart_checkout"},
    {name: "Empresas", route: "empresa", icon: "settings_heart"}

  ];  

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)'); // Establece un maximo de 600px para considerar el Medio como android
  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    console.log("sidenav - ngOnInit");

    // Obtencion del usuario con el que estamos conectados en el login de keycloak
    //this.username = this.keycloakService.getUsername();

  }

  /**
   * Cerrar la sesion de login mediante Keycloak
   */
  logout(): void {
    this.keycloakService.logout();
  }

}
