import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClienteListComponent } from './components/clientes/cliente-list/cliente-list.component';
import { CuentaListComponent } from './components/cuentas/cuenta-list/cuenta-list.component';
import { MovimientoListComponent } from './components/movimientos/movimiento-list/movimiento-list.component';
import { ReporteComponent } from './components/reportes/reporte.component';

const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClienteListComponent },
  { path: 'cuentas', component: CuentaListComponent },
  { path: 'movimientos', component: MovimientoListComponent },
  { path: 'reportes', component: ReporteComponent },
  { path: '**', redirectTo: 'clientes' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
