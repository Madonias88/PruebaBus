# TODO: Corregir selección de asientos para mostrar ocupados y reservados

## Información Gathered
- Asientos aparecen todos disponibles inicialmente porque fetchAsientos no consulta reservas existentes.
- Estados: available (verde), reserved (amarillo, temporal), occupied (rojo, confirmado via reservas).
- ReservasService solo tiene crearReserva; necesita getReservas(viajeId).
- fetchAsientos en boletos.ts mapea asientos de API pero no marca ocupados basados en reservas.
- CSS .reserved es orange; cambiar a yellow.

## Plan
- [x] Agregar método getReservas(viajeId) en ReservasService para obtener reservas por viaje.
- [x] Modificar fetchAsientos en boletos.ts: después de obtener asientos, consultar reservas y marcar asientos ocupados si están en reservas.
- [x] Cambiar .reserved en boletos.css de orange a yellow.

## Dependent Files to be edited
- [x] frontend_BusConnect/src/app/services/reservas.service.ts: Agregado getReservas.
- [x] frontend_BusConnect/src/app/vistas/boletos/boletos.ts: Modificado fetchAsientos para integrar reservas.
- [x] frontend_BusConnect/src/app/vistas/boletos/boletos.css: Cambiado color de .reserved.

## Followup steps
- [x] Probar que asientos ocupados aparezcan rojos desde el inicio.
- [x] Verificar que reservados sean amarillos durante selección.
- [x] Asegurar que disponibles sean verdes.
- [x] Ejecutar ng build para verificar no hay errores.
