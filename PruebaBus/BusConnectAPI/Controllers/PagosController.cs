using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using BusConnectAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class PagosController : ControllerBase
{
    private readonly OracleService _oracle;

    public PagosController(OracleService oracle)
    {
        _oracle = oracle;
    }

    [HttpPost]
    public IActionResult RegistrarPago([FromBody] Pagos pago)
    {
        using var conn = _oracle.GetConnection();
        conn.Open();

        using var cmd = new OracleCommand(
            "INSERT INTO pagos (pago_id, reserva_id, monto, metodo_pago, estado, fecha_pago) VALUES (pagos_seq.NEXTVAL, :reservaId, :monto, :metodo, :estado, SYSDATE)",
            conn
        );

        cmd.Parameters.Add(new OracleParameter("reservaId", pago.ReservaId));
        cmd.Parameters.Add(new OracleParameter("monto", pago.Monto));
        cmd.Parameters.Add(new OracleParameter("metodo", pago.MetodoPago));
        cmd.Parameters.Add(new OracleParameter("estado", pago.Estado));

        cmd.ExecuteNonQuery();

        return Ok(new { mensaje = "Pago registrado correctamente" });
    }
}