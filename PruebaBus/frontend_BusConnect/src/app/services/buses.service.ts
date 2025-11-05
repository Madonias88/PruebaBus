import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bus {
  bus_id: number;
  placa: string;
  modelo: string;
  capacidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  constructor(private http: HttpClient) { }

  getBuses(): Observable<Bus[]> {
    return this.http.get<Bus[]>(`${environment.apiUrl}/buses`);
  }
}
