import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Importamos las rutas del modulo router-child.module
const routes: Routes = [
  {
      path: 'dashboard',
      component: DashboardComponent, 
      loadChildren: () => import('./router-child.module').then(m => m.RouterChildModule) 
  }
]

@NgModule({
  declarations: [],
  imports: [ 
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
