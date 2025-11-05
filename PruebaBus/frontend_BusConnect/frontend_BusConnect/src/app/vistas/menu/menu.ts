import { Component, } from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {Footer} from '../footer/footer';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
   RouterModule, MatIconModule, CommonModule, Footer
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  
}
