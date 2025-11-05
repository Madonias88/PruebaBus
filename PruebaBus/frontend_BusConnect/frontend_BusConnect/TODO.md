# TODO: Agregar seguridad al sitio sin perder funcionalidad

## Información Gathered
- Proyecto funcional: API .NET con Oracle y frontend Angular.
- No requiere autenticación de usuarios.
- Necesidad: Proteger contra exposición de código fuente e inyecciones SQL.
- Backend: Controllers usan OracleParameter, pero falta validación de inputs.
- Frontend: Falta sanitización de inputs y validaciones.
- CORS demasiado permisivo.
- No hay rate limiting ni HTTPS forzado.

## Plan
- [x] Agregar validaciones de entrada en modelos del backend usando DataAnnotations.
- [x] Actualizar controllers para validar inputs y manejar errores.
- [ ] Agregar rate limiting a la API (omitido por compatibilidad).
- [x] Habilitar HTTPS en Program.cs.
- [ ] Restringir CORS a orígenes específicos si es posible.
- [ ] En frontend, agregar validaciones de formularios y sanitización de inputs.
- [ ] Probar todos los endpoints para asegurar funcionalidad intacta.

## Dependent Files to be edited
- [ ] BusConnectAPI/BusConnectAPI/Models/*.cs: Agregar DataAnnotations.
- [ ] BusConnectAPI/BusConnectAPI/Controllers/*.cs: Validar inputs.
- [ ] BusConnectAPI/BusConnectAPI/Program.cs: Rate limiting, HTTPS, CORS.
- [ ] BusConnectAPI/BusConnectAPI/BusConnectAPI.csproj: Agregar paquetes si necesarios.
- [ ] frontend_BusConnect/frontend_BusConnect/src/app/vistas/*/*.ts: Validaciones en componentes.
- [ ] frontend_BusConnect/frontend_BusConnect/src/app/services/*.ts: Sanitización en servicios.

## Followup steps
- [ ] Ejecutar pruebas en API y frontend.
- [ ] Verificar que no haya errores de compilación.
- [ ] Asegurar que la funcionalidad existente no se vea afectada.
