import { Component } from '@angular/core';

interface NavItem {
  ruta: string;
  etiqueta: string;
  icono: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  items: NavItem[] = [
    { ruta: '/clientes', etiqueta: 'Clientes', icono: 'people' },
    { ruta: '/cuentas', etiqueta: 'Cuentas', icono: 'account_balance' },
    { ruta: '/movimientos', etiqueta: 'Movimientos', icono: 'swap_horiz' },
    { ruta: '/reportes', etiqueta: 'Reportes', icono: 'assessment' },
  ];
}
