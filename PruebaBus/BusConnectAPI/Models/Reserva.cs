public class Reserva
{
    public int ReservaId { get; set; }
    public int UsuarioId { get; set; }
    public int ViajeId { get; set; }
    public int AsientoId { get; set; }
    public decimal MontoTotal { get; set; }
    public DateTime FechaReserva { get; set; }
}