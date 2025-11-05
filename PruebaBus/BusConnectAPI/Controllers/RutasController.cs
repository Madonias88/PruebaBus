using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class RutasController : ControllerBase
{
    private readonly OracleService _oracle;

    public RutasController(OracleService oracle)
    {
        _oracle = oracle;
    }

    [HttpGet]
    public IActionResult GetRutas()
    {
        var rutas = new List<object>();

        using var conn = _oracle.GetConnection();
        conn.Open();

        using var cmd = new OracleCommand("SELECT ruta_id, nombre, descripcion FROM rutas WHERE activa = 1", conn);
        using var reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            rutas.Add(new {
                ruta_id = reader.GetInt32(0),
                nombre = reader.GetString(1),
                descripcion = reader.GetString(2)
            });
        }

        return Ok(rutas);
    }
}