import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Email {
  Destinatario: string;
  Asunto?: string;
  Mensaje?: string;
  Archivo?: File;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = `${environment.apiUrl}/email`; // Endpoint en tu backend

  constructor(private http: HttpClient) { }

  enviarTicket(pdfFile: Blob, destinatario: string): Observable<any> {
    const formData = new FormData();
    formData.append('Destinatario', destinatario); // coincide con el backend
    formData.append('Asunto', 'Tus boletos BusConnect'); // opcional
    formData.append('Mensaje', 'Gracias por viajar con BusConnect'); // opcional
    formData.append('Archivo', pdfFile, 'boleto.pdf'); // coincide con el backend
  
    return this.http.post(`${this.apiUrl}/enviar`, formData);
  }  
}
