using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;
using BusConnectAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly OracleService _oracle;

    public UsuariosController(OracleService oracle)
    {
        _oracle = oracle;
    }

    [HttpPost]
    public IActionResult CrearUsuario([FromBody] Usuario usuario)
    {
        using var conn = _oracle.GetConnection();
        conn.Open();

        using var cmd = new OracleCommand(
            "INSERT INTO usuarios (usuario_id, nombre, email, password_hash, salt, telefono, rol, estado) VALUES (usuarios_seq.NEXTVAL, :nombre, :email, :hash, :salt, :telefono, 'CLIENTE', 'ACTIVO')",
            conn
        );

        // Simulación de hash y salt (puedes mejorar esto con una librería real)
        string hash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("123456"));
        string salt = Guid.NewGuid().ToString();

        cmd.Parameters.Add(new OracleParameter("nombre", usuario.Nombre));
        cmd.Parameters.Add(new OracleParameter("email", $"{usuario.Nombre.ToLower()}@example.com")); // temporal
        cmd.Parameters.Add(new OracleParameter("hash", hash));
        cmd.Parameters.Add(new OracleParameter("salt", salt));
        cmd.Parameters.Add(new OracleParameter("telefono", usuario.Telefono));

        cmd.ExecuteNonQuery();

        return Ok(new { mensaje = "Usuario creado correctamente" });
    }
}