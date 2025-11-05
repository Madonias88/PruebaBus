import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Asiento {
  Estado: string;
  asiento_id: number;
  bus_id: number;
  numero: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsientosService {

  constructor(private http: HttpClient) { }

  getAsientos(busId: number, viajeId: number): Observable<Asiento[]> {
    return this.http.get<Asiento[]>(`${environment.apiUrl}/asientos?busId=${busId}&viajeId=${viajeId}`);
  }
}
