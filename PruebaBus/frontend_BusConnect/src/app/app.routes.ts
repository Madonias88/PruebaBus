import { Routes } from '@angular/router';
import {Menu} from './vistas/menu/menu';
import {Inicio} from './vistas/inicio/inicio';
import {Rutas} from './vistas/rutas/rutas';
import {Reservas} from './vistas/reservas/reservas';
import {Boletos} from './vistas/boletos/boletos';


export const routes: Routes = [
    {
        path: '',
        component: Menu,
        children: [
            { path: '', component: Inicio},
            { path: 'rutas', component: Rutas},
            { path : 'reservas', component: Reservas},
            { path : 'boletos', component: Boletos}
        ]
    },
    // rutas fuera del menú:
 
    {path: '**', redirectTo: ''} // redirigir a inicio si no coincide ninguna ruta
];
