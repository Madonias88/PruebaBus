import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reserva {
  UsuarioId: number;
  ViajeId: number;
  AsientoId: number;
  MontoTotal: number;
  Nombre: string;
  Dpi: string;
  Telefono: string;
}

export interface ReservaResponse {
  reservaId: number;
  usuarioId: number;
  viajeId: number;
  asientoId: number;
  montoTotal: number;
  nombre: string;
  dpi: string;
  telefono: string;
  fechaReserva: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private http: HttpClient) { }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reservas`, reserva);
  }

  getReservas(viajeId: number): Observable<ReservaResponse[]> {
    return this.http.get<ReservaResponse[]>(`${environment.apiUrl}/reservas?viajeId=${viajeId}`);
  }
}
