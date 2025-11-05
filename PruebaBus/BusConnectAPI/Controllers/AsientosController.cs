using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using BusConnectAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class AsientosController : ControllerBase
{
    private readonly OracleService _oracle;

    public AsientosController(OracleService oracle)
    {
        _oracle = oracle;
    }

    [HttpGet]
    public IActionResult GetAsientos(int busId, int viajeId)
    {
        var asientos = new List<Asiento>();
        using var conn = _oracle.GetConnection();
        conn.Open();

        using var cmd = new OracleCommand(@"
        SELECT 
            a.asiento_id,
            a.bus_id,
            a.numero,
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM reservas r
                    WHERE r.asiento_id = a.asiento_id
                      AND r.viaje_id = :viajeId
                      AND UPPER(r.estado) IN ('CONFIRMADA', 'OCUPADA')
                ) THEN 'ocupado'
                WHEN EXISTS (
                    SELECT 1 FROM reservas r
                    WHERE r.asiento_id = a.asiento_id
                      AND r.viaje_id = :viajeId
                      AND UPPER(r.estado) = 'RESERVADA'
                ) THEN 'reservado'
                ELSE 'disponible'
            END AS estado
        FROM asientos a
        WHERE a.bus_id = :busId
        ORDER BY TO_NUMBER(a.numero)", conn);

        cmd.BindByName = true;
        cmd.Parameters.Add(new OracleParameter("viajeId", viajeId));
        cmd.Parameters.Add(new OracleParameter("busId", busId));

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            asientos.Add(new Asiento
            {
                AsientoId = reader.GetInt32(0),
                BusId = reader.GetInt32(1),
                Numero = reader.GetString(2),
                Estado = reader.GetString(3)
            });
        }

        return Ok(asientos);
    }
}
