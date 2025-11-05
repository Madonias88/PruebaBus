import { CommonModule } from '@angular/common';
import { inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { RutasService, Ruta } from '../../services/rutas.service';
import { BusesService, Bus } from '../../services/buses.service';
import { ViajesService, Viaje } from '../../services/viajes.service';
import { AsientosService, Asiento } from '../../services/asientos.service';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-boletos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatStepperModule, MatStepper,
    RouterModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './boletos.html',
  styleUrls: ['./boletos.css'],
})


export class Boletos implements OnInit {
  showBusAnimation = false;
  // Función para manejar la animación y avanzar al siguiente paso
  goToNextStep(stepper: MatStepper, isSeatStep: boolean = false) {
    const currentStep = stepper.selected;
    const stepControl = currentStep?.stepControl as FormGroup;
  
    if (stepControl && stepControl.invalid) {
      stepControl.markAllAsTouched(); // Esto hará que se muestren los errores
      return; // Evita que avance
    }
    //mostrar animación y continuar 
    this.showBusAnimation = true;
  
    setTimeout(() => {
      this.showBusAnimation = false;
  
      if (isSeatStep) {
        this.generatePassengerForms();
        this.startCountdown();
      }
  
      stepper.next();
    }, 3000);
  }
  // rutas 
  private router = inject(Router);
  private rutasService = inject(RutasService);
  private busesService = inject(BusesService);
  private viajesService = inject(ViajesService);
  private asientosService = inject(AsientosService);
  private reservasService = inject(ReservasService);
  private cdr = inject(ChangeDetectorRef);
  origin: any;
  constructor() {
    const navigation = history.state; //obtienes los datos enviados
    if (navigation && navigation.destino) {
      this.secondFormGroup.patchValue({
        fromCtrl: 'Guatemala',
        rutaCtrl: this.extraerDestino(navigation.destino)
      });
    }
  }
    // Extrae el destino del título de la ruta
    extraerDestino(titulo: string): string {
      const partes = titulo.split('–');
      return partes.length > 1 ? partes[1].trim() : '';
    }
  private _formBuilder = inject(FormBuilder);

  rutas: Ruta[] = [];
  buses: Bus[] = [];
  viajes: Viaje[] = [];
  availableViajes: Viaje[] = [];
  selectedViaje: Viaje | null = null;
  selectedHorario: string | null = null;
  isLoading = false;
  rutasLoading: boolean = true;
  rutasError: string = '';
  viajesError: string = '';
  asientosError: string = '';
  Asientos =  [
    { number: 1, top: '5%', left: '15%' }, { number: 5, top: '5%', left: '23%' }, { number: 9, top: '5%', left: '30.5%' }, 
    { number: 13, top: '5%', left: '38%' }, { number: 17, top: '5%', left: '46%' }, { number: 21, top: '5%', left: '53%' }, 
    { number: 25, top: '5%', left: '61%' }, { number: 29, top: '5%', left: '68.5%' }, { number: 33, top: '5%', left: '76%' },
    { number: 37, top: '5%', left: '83.5%' }, { number: 41, top: '5%', left: '91%' },
  
    { number: 2, top: '25%', left: '15%' }, { number: 6, top: '25%', left: '23%' }, { number: 10, top: '25%', left: '30.5%' },
    { number: 14, top: '25%', left: '38%' }, { number: 18, top: '25%', left: '46%' }, { number: 22, top: '25%', left: '53%' },
    { number: 26, top: '25%', left: '61%' }, { number: 30, top: '25%', left: '68.5%' }, { number: 34, top: '25%', left: '76%' },
    { number: 38, top: '25%', left: '83.5%' }, { number: 42, top: '25%', left: '91%' }, { number: 43, top: '42%', left: '91%' },
  
    { number: 3, top: '61%', left: '15%' }, { number: 7, top: '61%', left: '23%' }, { number: 11, top: '61%', left: '30.5%' },
    { number: 15, top: '61%', left: '38%' }, { number: 19, top: '61%', left: '46%' }, { number: 23, top: '61%', left: '53%' },
    { number: 27, top: '61%', left: '61%' }, { number: 31, top: '61%', left: '68.5%' }, { number: 35, top: '61%', left: '76%' },
    { number: 39, top: '61%', left: '84%' }, { number: 44, top: '61%', left: '91%' },
  
    { number: 4, top: '80%', left: '15%' }, { number: 8, top: '80%', left: '23%' }, { number: 12, top: '80%', left: '30.5%' },
    { number: 16, top: '80%', left: '38%' }, { number: 20, top: '80%', left: '46%' }, { number: 24, top: '80%', left: '53%' },
    { number: 28, top: '80%', left: '61%' }, { number: 32, top: '80%', left: '68.5%' }, { number: 36, top: '80%', left: '76%' },
    { number: 40, top: '80%', left: '84%' }, { number: 45, top: '80%', left: '91%' }
  ].map(s => ({ ...s, status: 'available' }));

  ngOnInit() {
    this.fetchRutas();
    this.fetchBuses();
  }
  onDateNext(animate = false) {
    const rutaId = this.secondFormGroup.get('rutaCtrl')?.value;
    const fecha = this.thirdFormGroup.get('date')?.value;
  
    if (!rutaId || !fecha) return;
  
    this.fetchViajes(Number(rutaId), fecha);
  
    if (animate) {
      this.showBusAnimation = true;
      setTimeout(() => {
        this.showBusAnimation = false;
        this.stepper.next();
      }, 3000);
    } else {
      this.stepper.next();
    }
  }

  onViajeNext(animate = false) {
    const viaje = this.viajeFormGroup.get('viaje')?.value;
    if (!viaje) return;
  
    const selected = this.availableViajes.find(v => v.viaje_id === Number(viaje));
    if (!selected) return;
 
    this.selectedViaje = { ...selected };
    this.selectedHorario = selected.fecha_salida; // <-- aquí guardamos el horario

    this.fetchAsientos(selected.bus_id, selected.viaje_id);
    this.cdr.detectChanges();

    if (animate) {
      this.showBusAnimation = true;
      setTimeout(() => {
        this.showBusAnimation = false;
        this.stepper.next();
      }, 3000);
    } else {
      this.stepper.next();
    }
  }
  

  fetchRutas() {
    this.rutasLoading = true;
    this.rutasService.getRutas().subscribe({
      next: data => { this.rutas = data; this.rutasLoading = false; },
      error: err => { console.error(err); this.rutasLoading = false; this.rutasError = 'Error loading routes'; }
    });
  }

  fetchBuses() {
    this.busesService.getBuses().subscribe({
      next: data => this.buses = data,
      error: err => console.error(err)
    });
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

fetchViajes(rutaId: number, fecha: Date) {
  const formattedFecha = this.formatDate(fecha);
  this.isLoading = true;

  this.viajesService.getViajes(rutaId, formattedFecha).subscribe({
    next: data => {
      console.log('Datos crudos recibidos de la API:', data);

      // Transformar propiedades del backend (camelCase/PascalCase) a snake_case
      this.viajes = data.map(v => ({
        viaje_id: v.viajeId,
        ruta_id: v.rutaId,
        bus_id: v.busId,
        fecha_salida: v.fechaSalida,
        fecha_llegada_estimada: v.fechaLlegadaEstimada,
        estado: v.estado
      }));

      this.availableViajes = this.viajes;
      this.isLoading = false;
      this.cdr.detectChanges();

      console.log('Viajes transformados:', this.availableViajes);
    },
    error: err => {
      console.error('Error al obtener viajes:', err);
      this.isLoading = false;
      this.viajesError = 'Error al cargar los viajes.';
    }
  });
}



fetchAsientos(busId: number, viajeId: number) {
  this.isLoading = true;
  this.asientosService.getAsientos(busId, viajeId).subscribe({
    next: data => {
      console.log('Asientos recibidos de API:', data);

      // 🔍 Prueba en consola para verificar mapeo real
      const pruebaMapeo = data.map(apiSeat => {
        const estado = (apiSeat.Estado ?? apiSeat.estado ?? '').toLowerCase();
        let status = 'available';
        if (estado.includes('ocup')) status = 'occupied';
        else if (estado.includes('reserv')) status = 'reserved';
        return {
          numero: apiSeat.numero,
          estadoOriginal: apiSeat.Estado ?? apiSeat.estado,
          statusMapped: status
        };
      });
      console.table(pruebaMapeo);

      // Mapeo real para la UI
      this.seats = this.Asientos.map(pos => {
        const apiSeat = data.find(s => Number(s.numero) === pos.number);

        let status = 'available';
        if (apiSeat) {
          const estado = (apiSeat.Estado ?? apiSeat.estado ?? '').toLowerCase();
          if (estado.includes('ocup')) status = 'occupied';
          else if (estado.includes('reserv')) status = 'reserved';
        }

        return {
          ...pos,
          number: String(pos.number),
          status,
          asiento_id: apiSeat ? apiSeat.asiento_id : 0,
          raw: apiSeat ? apiSeat.numero : String(pos.number)
        };
      });

      console.log('Asientos mapeados:', this.seats);
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: err => {
      console.error('Error al cargar asientos:', err);
      this.seats = this.Asientos.map(pos => ({
        ...pos,
        number: String(pos.number),
        status: 'available',
        asiento_id: 0,
        raw: String(pos.number)
      }));
      this.isLoading = false;
      this.asientosError = 'Error al cargar los asientos.';
    }
  });
}

  @ViewChild('stepper') stepper!: MatStepper;

  // Formularios
  passengerFormArray: FormArray<FormGroup> = this._formBuilder.array<FormGroup>([]);
  passengerFormGroup = this._formBuilder.group({
    passengers: this.passengerFormArray
  });

  countdown = '05:00';  // inicaliza el temporizador
  paymentConfirmed = false;
  timerInterval: any;

  
  secondFormGroup = this._formBuilder.group({
    fromCtrl: ['Guatemala'], // Add fromCtrl to the form group
    rutaCtrl: ['', [Validators.required]
  ],
  });

  thirdFormGroup = this._formBuilder.group({
    date: [null, [Validators.required
    ] ],
  });

  viajeFormGroup = this._formBuilder.group({
    viaje: ['', [Validators.required]],
  });

  seats: {
    raw: string; number: string; status: string; asiento_id: number; top?: string; left?: string; 
}[] = [];

    // Esta función se llama cuando se hace clic en “Siguiente” del paso Asientos
    onSeatsNext() {
      this.generatePassengerForms();
      this.startCountdown();
      this.stepper.next();
    }

// Genera formularios dinámicos para cada pasajero basado en los asientos seleccionados
generatePassengerForms(): void {
  if (this.passengerFormArray.length > 0) return; // No lo regeneres si ya existe
  this.selectedSeats.forEach(() => {
    this.passengerFormArray.push(this._formBuilder.group({
      
      name: ['',[
         Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/), // Solo letras y espacios, incluyendo acentos
        Validators.minLength(10),
        Validators.maxLength(50)
      ]
      ],
      id: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{13}$/),
        Validators.minLength(13),
        Validators.maxLength(13)
      ]
      ],
      phone: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{8}$/),
        Validators.minLength(8),
        Validators.maxLength(8)
      ] 
      ],
    }));
  });
  this.passengerFormGroup.setControl('passengers', this.passengerFormArray);
}
paymentFormGroup = this._formBuilder.group({
  email: ['', [Validators.required, Validators.email]],

  cardNumber: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[0-9]{16}$/) // exactamente 16 dígitos
    ]
  ],

  expiry: [
    '',
    [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/) // formato MM/YY
    ]
  ],

  cvv: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[0-9]{3}$/) // exactamente 3 dígitos
    ]
  ]
});
  // Temporizador
  startCountdown() {
    let total = 5 * 60; // 5 minutos en segundos
    clearInterval(this.timerInterval); // Limpia cualquier temporizador previo
    this.countdown = this.formatTime(total); // muestra el tiempo inicial

    this.timerInterval = setInterval(() => {
      total--;
      this.countdown = this.formatTime(total);
      
      if (total <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  handleTimeout() {
    this.seats.forEach(seat => {
      if (seat.status === 'reserved') seat.status = 'available';
    });
    this.selectedSeats = [];
    alert('El tiempo expiró. La reserva ha sido cancelada.');
    this.resetStepper();
  }

  // Clase CSS dinámica para los asientos
  getSeatClass(status: string): string {
    return `seat ${status}`;
  }

  // Removed setFilter method as filterStatus is not used


// Array para almacenar los asientos seleccionados
  selectedSeats: string[] = [];
  // Manejo de selección de asientos
selectSeat(seatNumber: number): void {
  const seat = this.seats.find(s => Number(s.number) === seatNumber);
  if (!seat) return;

  if (seat.status === 'available') {
    seat.status = 'reserved';
    this.selectedSeats.push(seat.raw); // guarda "B1", "C2", etc.
  } else if (seat.status === 'reserved') {
    seat.status = 'available';
    this.selectedSeats = this.selectedSeats.filter(s => s !== seat.raw);
  }
  // Ignora si está ocupado
}
  
   // Pago del boleto
paySeat() {
  if (!this.selectedViaje) {
    alert('Debe seleccionar un viaje antes de continuar.');
    return;
  }

  // Validar formulario de pasajeros
  if (this.passengerFormArray.invalid) {
    alert('Por favor complete todos los datos de los pasajeros correctamente.');
    return;
  }

  // Validar que el número de pasajeros coincida con asientos seleccionados
  if (this.passengerFormArray.length !== this.selectedSeats.length) {
    alert('El número de pasajeros no coincide con los asientos seleccionados.');
    return;
  }

  /* Construir objeto reserva
  const reserva = {
    email: this.email,
    cardInfo: this.cardInfo,
    viajeId: this.selectedViaje.viaje_id,
    from: this.getSelectedRutaName().split(' - ')[0] || '',
    to: this.getSelectedRutaName().split(' - ')[1] || '',
    fecha: this.selectedViaje.fecha_salida,
    bus: this.getSelectedBusName(),
    passengers: this.passengerFormArray.controls.map((form, index) => ({
      nombre: form.get('name')?.value,
      dpi: form.get('id')?.value,
      telefono: form.get('phone')?.value,
      asiento: this.selectedSeats[index] // Usar el formato real "A1", "B2", etc.
    }))
  };*/



  const reserva = {
    email: this.paymentFormGroup.get('email')?.value,
    cardInfo: {
      cardNumber: this.paymentFormGroup.get('cardNumber')?.value,
      expiry: this.paymentFormGroup.get('expiry')?.value,
      cvv: this.paymentFormGroup.get('cvv')?.value
    },
    viajeId: this.selectedViaje.viaje_id,
    from: this.getSelectedRutaName().split(' - ')[0] || '',
    to: this.getSelectedRutaName().split(' - ')[1] || '',
    fecha: this.selectedViaje.fecha_salida,
    bus: this.getSelectedBusName(),
    passengers: this.passengerFormArray.controls.map((form, index) => {
      const asientoConLetra = this.selectedSeats[index];
      const asientoNumerico = asientoConLetra.replace(/[^\d]/g, '');
  
      return {
        nombre: form.get('name')?.value,
        dpi: form.get('id')?.value,
        telefono: form.get('phone')?.value,
        asiento: asientoNumerico
      };
    })
  };


  console.log('Enviando reserva:', reserva);
  

  // Enviar reserva al backend
  this.reservasService.crearReserva(reserva).subscribe({
    next: (response: any) => {
      console.log('Reserva exitosa:', response);

      // Actualizar estado de asientos visualmente
      this.fetchAsientos(this.selectedViaje!.bus_id, this.selectedViaje!.viaje_id);

      this.paymentConfirmed = true;
      clearInterval(this.timerInterval);
      alert('✅ Reserva registrada y pago confirmado');

    },
    error: (err) => {
      console.error('Error al enviar reserva:', err);
      let errorMessage = 'Error al procesar la reserva';

      if (err.error?.detalle) {
        errorMessage += `: ${err.error.detalle}`;
      } else if (err.error?.mensaje) {
        errorMessage += `: ${err.error.mensaje}`;
      }

      alert(errorMessage);
    }
  });
}



verReserva() {
  if (!this.selectedViaje) return;
  const ruta = this.rutas.find(r => r.ruta_id === this.selectedViaje!.ruta_id);
  this.router.navigate(['/reservas'], {
    state: {
      pasajeros: this.passengerFormArray.controls.map((form, index) => ({
        nombre: form.get('name')?.value,
        dpi: form.get('id')?.value,
        telefono: form.get('phone')?.value,
        from: ruta?.nombre.split(' - ')[0] || '',
        to: ruta?.nombre.split(' - ')[1] || '',
        fecha: this.thirdFormGroup.get('date')?.value,
        asiento: this.selectedSeats[index]
      }))
    }
  });
}

  // Obtiene el nombre del viaje seleccionado
  getSelectedViajeName(): string {
    const viajeId = this.viajeFormGroup.get('viaje')?.value;
    const viaje = this.availableViajes.find(v => v.viaje_id === Number(viajeId));
    return viaje ? `Viaje ${viaje.viaje_id} - Bus ${this.buses.find(b => b.bus_id === viaje.bus_id)?.placa}` : 'No seleccionado';
  }

  // Obtiene el nombre del bus seleccionado
  getSelectedBusName(): string {
    if (!this.selectedViaje) return 'No seleccionado';
    const bus = this.buses.find(b => b.bus_id === this.selectedViaje!.bus_id);
    return bus ? bus.placa : 'No seleccionado';
  }

  // Obtiene el nombre de la ruta seleccionada
  getSelectedRutaName(): string {
    const rutaId = Number(this.secondFormGroup.get('rutaCtrl')?.value);
    const ruta = this.rutas.find(r => r.ruta_id === rutaId);
    return ruta ? ruta.nombre : 'No seleccionada';
  }

  getBusPlaca(busId: number): string {
    const bus = this.buses.find(b => b.bus_id === busId);
    return bus ? bus.placa : 'N/A';
  }

  // Reinicia el stepper y los formularios
  resetStepper(): void {

  // Reinicia los campos
    this.stepper.reset();
    this.paymentConfirmed = false;
    this.paymentFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.viajeFormGroup.reset();
    this.passengerFormArray.clear();
    this.selectedSeats = [];
    clearInterval(this.timerInterval);
    // Reinicia el estado de los asientos
    this.seats.forEach(seat => {
      if (seat.status === 'selected') seat.status = 'available';
    });
  }
  isLinear = false;

  minDate = new Date(); 
}
