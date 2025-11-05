import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Viaje {
  viaje_id: number;
  ruta_id: number;
  bus_id: number;
  fecha_salida: string;
  fecha_llegada_estimada: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  constructor(private http: HttpClient) { }

  getViajes(rutaId: number, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/viajes?rutaId=${rutaId}&fecha=${fecha}`);
  }
}
