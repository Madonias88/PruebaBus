    using Microsoft.AspNetCore.Mvc;
    using Oracle.ManagedDataAccess.Client;
    using System.Collections.Generic;

    [ApiController]
    [Route("api/[controller]")]
    public class BusesController : ControllerBase
    {
        private readonly OracleService _oracle;

        public BusesController(OracleService oracle)
        {
            _oracle = oracle;
        }

        [HttpGet]
        public IActionResult GetBuses()
        {
            var buses = new List<object>();

            using var conn = _oracle.GetConnection();
            conn.Open();

            using var cmd = new OracleCommand("SELECT bus_id, placa, modelo, capacidad FROM buses WHERE activo = 1", conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                buses.Add(new {
                    bus_id = reader.GetInt32(0),
                    placa = reader.GetString(1),
                    modelo = reader.GetString(2),
                    capacidad = reader.GetInt32(3)
                });
            }

            return Ok(buses);
        }
    }