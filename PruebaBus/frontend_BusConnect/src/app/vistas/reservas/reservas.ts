import { Component,  OnInit, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmailService } from '../../services/email';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css']
})
export class Reservas implements OnInit {
  pasajeros: any[] = [];  // inicializado vacío
  reserva: any = null;
  correo: string = '';
  correoPasajero: string = ''; // Agregada para compatibilidad con reenviar y enviarPDFPorCorreo()

mostrarModal =false;
tituloModal ='';
mensajeModal ='';
tipoModal: 'success'|'error'|'info' ='info';
enviandoCorreo = false; //  Nueva bandera para evitar duplicar “Enviando correo…

constructor(private router: Router, private emailService: EmailService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;

    if (state) {
      this.reserva = state['reserva'] || null;
      this.pasajeros = state['pasajeros'] || [];
      this.correo = state['correo'] || (this.reserva ? this.reserva.email : '');
    }
  }

 ngOnInit(): void {}

    ngAfterViewInit(): void {
      // pinta los boletos antes de generar el PDF
      setTimeout(() => {
        if (this.pasajeros.length > 0) {
          if (!this.correo) {
            this.mostrarAlerta('No hay correo detectado', 'no se enviará automáticamente.', 'error');
            return;
          }
       // 🔹 Solo aquí se muestra la alerta de "Enviando correo..."
       this.correoPasajero = this.correo;
       this.mostrarAlerta('Enviando correo...', 'Se está generando y enviando tu boleto.', 'info');
       this.generarPDF(true);
      }
    }, 3000);
  }

  regresar() {
    this.router.navigate(['/boletos']);
  }
  cerrarModal() {
    this.mostrarModal = false;
  }
  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') {
    this.tituloModal = titulo;
    this.mensajeModal = mensaje;
    this.tipoModal = tipo;
    this.mostrarModal = true;
  }

  /*Descargar PDF normalmente */
  descargarPDF(): void {
    this.generarPDF(false);
  }

  /** Botón enviar por correo en reservas */
  enviarPDFPorCorreo(): void {
    // Preguntar correo si no hay
    let correo = this.correoPasajero;
    if (!correo) {
      correo = prompt('Ingrese el correo para enviar los boletos:')?.trim() || '';
      if (!correo) {
        this.mostrarAlerta(' No se puede enviar el correo: falta dirección.','error');
        return;
      }
      this.correoPasajero = correo;
    }

    this.generarPDF(true);
  }

  /** Reenviar correo */
  reenviarCorreo(): void {
    this.enviarPDFPorCorreo();
  }

  /** Generar el PDF y opcionalmente enviarlo por correo */
  private generarPDF(enviarCorreo: boolean = false): void {
    const tickets = document.querySelectorAll<HTMLElement>('.ticket-reserva');

    if (!tickets.length) {
      return;
    }

    const opciones: any = {
      margin: 10,
      filename: `boletos_busconnect_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'css', after: '.page-break' }
    };

    const contenedorPDF = document.createElement('div');
    contenedorPDF.style.width = '210mm';
    contenedorPDF.style.fontFamily = 'Arial, sans-serif';
    contenedorPDF.style.color = '#333';
    contenedorPDF.style.paddingTop = '10mm';

    tickets.forEach((ticket, index) => {
      const clon = ticket.cloneNode(true) as HTMLElement;

      // Header
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="text-align:center; color:#1a437c; font-weight:bold; font-size:20px; margin-bottom:15px;">
          BUSCONNECT
        </div>
      `;
      clon.prepend(header);

      // Footer
      const footer = document.createElement('div');
      footer.innerHTML = `
        <div style="border-top:1px dashed #999; margin-top:15px; padding-top:8px; font-size:11px; text-align:center;">
          <p>Tu viaje seguro y confiable a cualquier destino.</p>
          <p>Horario: Lunes a Domingo 8:00 AM - 6:00 PM</p>
          <p>3a. Avenida 14-45 Zona 1, Guatemala, C.A.</p>
          <p>Tel: +502 5958 8391 | busconnectcorporacion2025@gmail.com</p>
        </div>
      `;
      clon.appendChild(footer);

      // Contenedor para centrar
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.justifyContent = 'center';
      wrapper.style.alignItems = 'center';
      wrapper.style.width = '180mm';
      wrapper.style.margin = '0 auto';
      wrapper.style.pageBreakInside = 'avoid';
      wrapper.style.pageBreakAfter = 'always';
      if (index > 0) wrapper.style.marginTop = '10mm';
      wrapper.classList.add('page-break');

      wrapper.appendChild(clon);
      contenedorPDF.appendChild(wrapper);
    });

    document.body.appendChild(contenedorPDF);

    html2pdf()
      .set(opciones)
      .from(contenedorPDF)
      .outputPdf('blob')
      .then((pdfBlob: Blob) => {
        document.body.removeChild(contenedorPDF);

        //  Si solo es descarga local
        if (!enviarCorreo) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(pdfBlob);
          link.download = `boletos_busconnect_${new Date().toISOString().split('T')[0]}.pdf`;
          link.click();
          return;
        }

        //  Si es envío de correo
        if (!this.correoPasajero) {
          const correoIngresado = prompt('Ingresa tu correo para recibir los boletos por email:')?.trim();
          if (!correoIngresado) {
            this.mostrarAlerta('No se envió el correo, falta dirección.', 'error');
            return;
          }
          this.correoPasajero = correoIngresado;
        }

        this.enviarCorreo(pdfBlob, this.correoPasajero);
      })
      .catch(() => {
        document.body.removeChild(contenedorPDF);
        this.mostrarAlerta(' Error al generar el PDF. Intenta nuevamente.', 'error');
      });
  }

  /** Enviar PDF por correo */
  private enviarCorreo(pdfBlob: Blob, destinatario: string) {
    this.emailService.enviarTicket(pdfBlob, destinatario).subscribe({
      next: (res) => {
        this.mostrarAlerta('Correo enviado',`El correo fue enviado correctamente a ${destinatario}.`, 'success');
      },
      error: (err) => {
        this.mostrarAlerta('Error','Error al enviar el correo. Puedes intentar reenviarlo.', 'error');
      }
    });
  }
} 
