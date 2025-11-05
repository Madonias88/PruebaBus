using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using System.Globalization;
using BusConnectAPI.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

[ApiController]
[Route("api/[controller]")]
public class ViajesController : ControllerBase
{
    private readonly OracleService _oracle;
    private readonly ILogger<ViajesController> _logger;

    public ViajesController(OracleService oracle, ILogger<ViajesController> logger)
    {
        _oracle = oracle;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetViajes(int rutaId, string fecha)
    {
        // Validación de parámetros
        if (rutaId <= 0)
        {
            _logger.LogWarning("Invalid rutaId provided: {RutaId}", rutaId);
            return BadRequest("rutaId must be greater than 0.");
        }

        if (string.IsNullOrEmpty(fecha))
        {
            _logger.LogWarning("Fecha string is null or empty.");
            return BadRequest("fecha is required.");
        }

        // Parse fecha string to DateTime using dd-MM-yyyy format
        if (!DateTime.TryParseExact(fecha, "dd-MM-yyyy", null, DateTimeStyles.None, out DateTime parsedFecha))
        {
            _logger.LogWarning("Invalid fecha format: {Fecha}", fecha);
            return BadRequest("Invalid fecha format. Use dd-MM-yyyy (e.g., 25-09-2025).");
        }

        _logger.LogInformation("Fetching viajes for rutaId: {RutaId} on date: {Fecha}", rutaId, parsedFecha.ToString("dd-MM-yyyy"));

        var viajes = new List<Viaje>();

        try
        {
            using var conn = _oracle.GetConnection();
            conn.Open();

            using var cmd = new OracleCommand(
                "SELECT viaje_id, ruta_id, bus_id, fecha_salida, fecha_llegada_estimada, estado FROM viajes WHERE ruta_id = :rutaId AND TRUNC(fecha_salida) = :fecha",
                conn
            );
            cmd.Parameters.Add(new OracleParameter("rutaId", rutaId));
            cmd.Parameters.Add(new OracleParameter("fecha", parsedFecha.Date)); // Ensure only date part is used

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                viajes.Add(new Viaje
                {
                    ViajeId = reader.GetInt32(0),
                    RutaId = reader.GetInt32(1),
                    BusId = reader.GetInt32(2),
                    FechaSalida = reader.GetDateTime(3),
                    FechaLlegadaEstimada = reader.GetDateTime(4),
                    Estado = reader.GetString(5)
                });
            }

            _logger.LogInformation("Found {Count} viajes for rutaId: {RutaId} on {Fecha}", viajes.Count, rutaId, parsedFecha.ToString("yyyy-MM-dd"));

            return Ok(viajes);
        }
        catch (OracleException ex)
        {
            _logger.LogError(ex, "Oracle error while fetching viajes for rutaId: {RutaId} on {Fecha}", rutaId, parsedFecha.ToString("yyyy-MM-dd"));
            return StatusCode(500, "Database error occurred.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while fetching viajes for rutaId: {RutaId} on {Fecha}", rutaId, parsedFecha.ToString("yyyy-MM-dd"));
            return StatusCode(500, "An error occurred while processing the request.");
        }
    }
}
