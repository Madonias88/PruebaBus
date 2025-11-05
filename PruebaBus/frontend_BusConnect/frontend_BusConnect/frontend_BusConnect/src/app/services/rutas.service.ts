import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ruta {
  ruta_id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor(private http: HttpClient) { }

  getRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${environment.apiUrl}/rutas`);
  }
}
