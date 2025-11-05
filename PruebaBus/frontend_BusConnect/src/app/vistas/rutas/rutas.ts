import { Component,OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; 
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface Ruta {
  titulo: string;
  imagen: string;
  duracion: string;
  salidas: string;
  servicios: string;
}

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './rutas.html',
  styleUrl: './rutas.css'
})
export class Rutas implements OnInit, OnDestroy { 
  //constructor y método para navegar a la vista de compra de boletos
  constructor(private router: Router) {}
  irAComprar(ruta: Ruta) {
    this.router.navigate(['/boletos'], {
      state: { destino: ruta.titulo }  // nombre de la ruta seleccionada
    });
  }
  fade = false;
  rutas: Ruta[] = [
    {
      titulo: 'Ciudad de Guatemala – Quiché',
      imagen: 'https://www.munisantacruzdelquiche.gob.gt/images/DJI_0187.jpg',
      duracion: '3 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – San Marcos',
      imagen: 'https://guategt.com/wp-content/uploads/2015/03/San-Marcos.jpg',
      duracion: '4 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Huehuetenango',
      imagen: 'https://aprende.guatemala.com/wp-content/uploads/2017/11/Municipio-de-Huehuetenango-Huehuetenango.jpg',
      duracion: '6 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Izabal',
      imagen: 'https://www.guatevalley.com/photo/photo_a1/1104/a9GAq4kFOFfnPV7WG9bY.jpg',
      duracion: '7 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Retalhuleu',
      imagen: 'https://agn.gt/wp-content/uploads/2021/11/PALACIO-DEPARTAMENTAL-DE-RETALHULEU.jpg',
      duracion: '3 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Chiquimula',
      imagen: 'https://aprende.guatemala.com/wp-content/uploads/2021/06/Municipio-de-Chiquimula-Chiquimula.jpg',
      duracion: '3 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Jutiapa',
      imagen: 'https://www.guatevalley.com/photo/photo_a1/1904/kv5FMGs6Q3jU7NCCSn5E.jpg',
      duracion: '2 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Zacapa',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkCclOlcSoSjiGAFc1_lxX0PIxMzjikty3bw&s',
      duracion: '2 horas y media',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – El Progreso',
      imagen: 'https://www.guatemala.com/fotos/2023/01/San-Antonio-La-Paz-El-Progreso-885x500.png',
      duracion: '1 hora con 45 minutos',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Baja Verapaz',
      imagen: 'https://aprende.guatemala.com/wp-content/uploads/2021/03/Descripci%C3%B3n-de-foto-Vista-a%C3%A9rea-y-de-d%C3%ADa-de-la-fiesta-titular-la-feria-desfile-e-iglesia-municipal-de-San-Jer%C3%B3nimo-Baja-Verapaz.-Cr%C3%A9dito-de-foto-Chome%C3%B1os-de-Coraz%C3%B3n.jpg',
      duracion: '3 horas',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Alta Verapaz',
      imagen: 'https://aprende.guatemala.com/wp-content/uploads/2017/11/Departamento-de-Alta-Verapaz-Guatemala2.jpg',
      duracion: '3 horas y media',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Santa Rosa',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvyUHssP_REpXHTcylg-n4s5u5bDZdurJYTA&s',
      duracion: '3 horas de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },

    {
      titulo: 'Ciudad de Guatemala – Escuintla',
      imagen: 'https://guategt.com/wp-content/uploads/2015/03/escuintla-800x445.jpeg',
      duracion: '1 hora de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Chimaltenango',
      imagen: 'https://guategt.com/wp-content/uploads/2023/11/municipio_chimaltenango2.jpg',
      duracion: '1 hora de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Totonicapan',
      imagen: 'https://i0.wp.com/concriterio.gt/wp-content/uploads/2021/02/D2bz25UWoAA_4lG.jpg?fit=1200%2C800&ssl=1',
      duracion: '2 hora de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Petén',
      imagen: 'https://www.guatemala.com/fotos/201710/Isla-de-Flores-Peten-es-uno-de-los-pueblos-mas-pintorescos-del-mundo-885x500.jpg',
      duracion: '8 horas de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Quetzaltenango',
      imagen: 'https://inguat.gob.gt/templates/yootheme/cache/80/Parque_Central_Xela_al_atardecer-8072da6d.jpeg',
      duracion: '2 horas de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Sololá',
      imagen: 'https://www.prensalibre.com/wp-content/uploads/2018/12/2341390d-f6ac-405d-bc1b-409352c8e643.jpg?quality=52',
      duracion: '3 horas con 45 minutos de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Sacatepéquez',
      imagen: 'https://mediaim.expedia.com/destination/1/74ddc5a8bc392ba990ada31c1bf76007.jpg',
      duracion: '30 minutos de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Suchitepéquez',
      imagen: 'https://aprende.guatemala.com/wp-content/uploads/2016/10/Municipio-de-Samayac-Suchitep%C3%A9quez.jpg',
      duracion: '2 horas con 45 minutos de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    },
    {
      titulo: 'Ciudad de Guatemala – Jalapa',
      imagen: 'https://aprende.guatemala.com/wp-content/uploads/2023/11/Municipio-de-Jalapa-Jalapa-3.jpg',
      duracion: '2 horas de camino',
      salidas: 'Cada 2 horas, de 5:00 a.m. a 8:00 p.m.',
      servicios: 'Wi-Fi, asientos reclinables, aire acondicionado'
    }

  ];

  currentIndex = 0;
  itemsPerPage = 3;
  autoSlideInterval: any;
  // Inicia el auto deslizamiento al cargar el componente
    ngOnInit(): void {
      this.autoSlideInterval = setInterval(() => {
        this.autoNext();
      }, 5000);
    }
    ngOnDestroy(): void {
        clearInterval(this.autoSlideInterval);
    }
  // Obtiene las rutas visibles según el índice actual y los elementos por página
    get rutasVisibles(): Ruta[] {
      return this.rutas.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    }
  // Navega a la siguiente página
    next() {
      if (this.currentIndex + this.itemsPerPage < this.rutas.length) {
        this.fade = true; // Inicia la transición de desvanecimiento
        setTimeout(() => {
        this.currentIndex += this.itemsPerPage;
        this.fade = false; // Termina la transición de desvanecimiento
      }, 300); // Duración de la transición
      }
    }
  
    prev() {
      if (this.currentIndex - this.itemsPerPage >= 0) {
        this.fade = true; // Inicia la transición de desvanecimiento
        setTimeout(() => {
        this.currentIndex -= this.itemsPerPage;
        this.fade = false; // Termina la transición de desvanecimiento
      }, 300); // Duración de la transición
      }
    }
  
      // Método auxiliar para avanzar y reiniciar al principio si llega al final
      autoNext() {
        this.fade = true; // Inicia la transición de desvanecimiento
        setTimeout(() => {
        const nextIndex = this.currentIndex + this.itemsPerPage;
  
        if (nextIndex >= this.rutas.length) {
          this.currentIndex = 0; //  reinicia correctamente
        } else {
          this.currentIndex = nextIndex;
        }
        this.fade = false; // Termina la transición de desvanecimiento
      }, 300); // Duración de la transición
      }
  }
  
