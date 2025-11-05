using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Collections.Generic;
using iTextSharp.text;
using iTextSharp.text.pdf;
using QRCoder;
using BusConnectAPI.Models;

[ApiController]
[Route("api/[controller]")]
public partial class ReservasController : ControllerBase
{
    private readonly OracleService _oracle;

    public ReservasController(OracleService oracle)
    {
        _oracle = oracle;
    }

// CORREGIR en ReservasController.cs
[HttpPost]
public IActionResult CrearReserva([FromBody] ReservaRequest request)
{
    if (request == null || request.Passengers == null || request.Passengers.Count == 0)
        return BadRequest(new { mensaje = "Datos de reserva inválidos" });

    using var conn = _oracle.GetConnection();
    conn.Open();
    using var transaction = conn.BeginTransaction();

    try
    {
        int usuarioId = 0;
        string nuevoTelefono = request.Passengers.First().Telefono;

        // Buscar o crear usuario
        using (var cmdUser = new OracleCommand("SELECT usuario_id, telefono FROM usuarios WHERE email = :email", conn))
        {
            cmdUser.Transaction = transaction;
            cmdUser.Parameters.Add(new OracleParameter("email", request.Email));
            using var reader = cmdUser.ExecuteReader();
            if (reader.Read())
            {
                usuarioId = Convert.ToInt32(reader["usuario_id"]);
                string telefonoActual = reader["telefono"]?.ToString() ?? "";
                if (!string.IsNullOrEmpty(nuevoTelefono) && telefonoActual != nuevoTelefono)
                {
                    using var cmdUpdate = new OracleCommand("UPDATE usuarios SET telefono = :tel WHERE usuario_id = :id", conn);
                    cmdUpdate.Transaction = transaction;
                    cmdUpdate.Parameters.Add(new OracleParameter("tel", nuevoTelefono));
                    cmdUpdate.Parameters.Add(new OracleParameter("id", usuarioId));
                    cmdUpdate.ExecuteNonQuery();
                }
            }
            else
            {
                using var cmdInsertUser = new OracleCommand(
                    "INSERT INTO usuarios (usuario_id, nombre, email, password_hash, salt, telefono, fecha_registro, rol, estado) " +
                    "VALUES (usuarios_seq.NEXTVAL, :nombre, :email, :pass, :salt, :telefono, SYSDATE, 'CLIENTE', 'ACTIVO') " +
                    "RETURNING usuario_id INTO :newId", conn);
                cmdInsertUser.Transaction = transaction;
                cmdInsertUser.Parameters.Add(new OracleParameter("nombre", request.Passengers.First().Nombre ?? "Nuevo Cliente"));
                cmdInsertUser.Parameters.Add(new OracleParameter("email", request.Email));
                cmdInsertUser.Parameters.Add(new OracleParameter("pass", "autogen"));
                cmdInsertUser.Parameters.Add(new OracleParameter("salt", "none"));
                cmdInsertUser.Parameters.Add(new OracleParameter("telefono", nuevoTelefono));
                var outParam = new OracleParameter("newId", OracleDbType.Int32, System.Data.ParameterDirection.Output);
                cmdInsertUser.Parameters.Add(outParam);
                cmdInsertUser.ExecuteNonQuery();
                usuarioId = Convert.ToInt32(outParam.Value.ToString());
            }
        }

        int viajeId = request.ViajeId;
        if (viajeId <= 0)
            throw new Exception("El ID del viaje no es válido.");

        int busId = ObtenerBusId(request.Bus);

        using (var cmdCheckViaje = new OracleCommand(
            "SELECT COUNT(*) FROM viajes WHERE viaje_id = :viajeId AND bus_id = :busId", conn))
        {
            cmdCheckViaje.Transaction = transaction;
            cmdCheckViaje.Parameters.Add(new OracleParameter("viajeId", viajeId));
            cmdCheckViaje.Parameters.Add(new OracleParameter("busId", busId));
            var existe = Convert.ToInt32(cmdCheckViaje.ExecuteScalar());
            if (existe == 0)
                throw new Exception($"No existe el viaje con ID {viajeId} para el bus {busId}");
        }

        decimal montoPorAsiento = 125m;

        foreach (var p in request.Passengers)
        {
            string numeroAsiento = p.Asiento;
            int asientoId = 0;

            using (var cmdFindAsiento = new OracleCommand(
                "SELECT asiento_id FROM asientos WHERE numero = :numero AND bus_id = :busId", conn))
            {
                cmdFindAsiento.Transaction = transaction;
                cmdFindAsiento.Parameters.Add(new OracleParameter("numero", numeroAsiento));
                cmdFindAsiento.Parameters.Add(new OracleParameter("busId", busId));
                var result = cmdFindAsiento.ExecuteScalar();
                if (result != null)
                {
                    asientoId = Convert.ToInt32(result);
                }
                else
                {
                    throw new Exception($"❌ Asiento no encontrado: {numeroAsiento} para busId={busId}");
                }
            }

            using (var cmdCheckAsiento = new OracleCommand(
                "SELECT COUNT(*) FROM reservas WHERE viaje_id = :viajeId AND asiento_id = :asientoId AND estado != 'CANCELADA'", conn))
            {
                cmdCheckAsiento.Transaction = transaction;
                cmdCheckAsiento.Parameters.Add(new OracleParameter("viajeId", viajeId));
                cmdCheckAsiento.Parameters.Add(new OracleParameter("asientoId", asientoId));
                var asientoOcupado = Convert.ToInt32(cmdCheckAsiento.ExecuteScalar());
                if (asientoOcupado > 0)
                    throw new Exception($"El asiento {numeroAsiento} ya está reservado para este viaje");
            }

            using var cmdReserva = new OracleCommand(
                "INSERT INTO reservas (reserva_id, usuario_id, viaje_id, asiento_id, monto_total, fecha_reserva, estado) " +
                "VALUES (reservas_seq.NEXTVAL, :usuarioId, :viajeId, :asientoId, :monto, SYSDATE, 'CONFIRMADA') " +
                "RETURNING reserva_id INTO :newReservaId", conn);
            cmdReserva.Transaction = transaction;
            cmdReserva.Parameters.Add(new OracleParameter("usuarioId", usuarioId));
            cmdReserva.Parameters.Add(new OracleParameter("viajeId", viajeId));
            cmdReserva.Parameters.Add(new OracleParameter("asientoId", asientoId));
            cmdReserva.Parameters.Add(new OracleParameter("monto", montoPorAsiento));
            var reservaOut = new OracleParameter("newReservaId", OracleDbType.Int32, System.Data.ParameterDirection.Output);
            cmdReserva.Parameters.Add(reservaOut);
            cmdReserva.ExecuteNonQuery();
            int reservaId = Convert.ToInt32(reservaOut.Value.ToString());

            using var cmdPago = new OracleCommand(
                "INSERT INTO pagos (pago_id, reserva_id, monto, metodo_pago, estado, fecha_pago) " +
                "VALUES (pagos_seq.NEXTVAL, :reservaId, :monto, :metodo, :estado, SYSDATE)", conn);
            cmdPago.Transaction = transaction;
            cmdPago.Parameters.Add(new OracleParameter("reservaId", reservaId));
            cmdPago.Parameters.Add(new OracleParameter("monto", montoPorAsiento));
            cmdPago.Parameters.Add(new OracleParameter("metodo", "Tarjeta"));
            cmdPago.Parameters.Add(new OracleParameter("estado", "Completado"));
            cmdPago.ExecuteNonQuery();
        }

        transaction.Commit();
        return Ok(new { mensaje = "Reserva creada exitosamente" });
    }
    catch (Exception ex)
    {
        transaction.Rollback();
        return StatusCode(500, new { mensaje = "Error al crear la reserva", detalle = ex.Message });
    }
}

    private void DebugAsientos(int busId, OracleConnection conn)
    {
        // Basic debug implementation: print available seats for the bus
        Console.WriteLine($"DEBUG: Asientos disponibles para Bus ID: {busId}");
        using var cmd = new OracleCommand("SELECT asiento_id, numero FROM asientos WHERE bus_id = :busId ORDER BY numero", conn);
        cmd.Parameters.Add(new OracleParameter("busId", busId));
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            Console.WriteLine($"  - Asiento ID: {reader["asiento_id"]}, Número: {reader["numero"]}");
        }
    }

    private int ObtenerBusId(string busPlaca)
    {
        using var conn = _oracle.GetConnection();
        conn.Open();

        using var cmd = new OracleCommand("SELECT bus_id FROM buses WHERE placa = :placa", conn);
        cmd.Parameters.Add(new OracleParameter("placa", busPlaca));

        var result = cmd.ExecuteScalar();
        if (result != null)
            return Convert.ToInt32(result);

        throw new Exception($"Bus no encontrado con placa: {busPlaca}");
    }

    [System.Text.RegularExpressions.GeneratedRegex("[^0-9]")]
    private static partial System.Text.RegularExpressions.Regex MyRegex();
}
