import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
    
  ],
  templateUrl: './reservas.html', 
  styleUrls: ['./reservas.css']
})
export class Reservas {
 pasajeros: any[] = [];
 data: any = {};

 constructor(private router: Router) {
  const nav = this.router.getCurrentNavigation();
  this.data = nav?.extras?.state || {};
}

regresar() {
  this.router.navigate(['/boletos']);
}
}

