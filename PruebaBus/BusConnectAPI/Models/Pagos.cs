public class Pagos
{
    public int PagoId { get; set; }
    public int ReservaId { get; set; }
    public decimal Monto { get; set; }
    public required string MetodoPago { get; set; }
    public required string Estado { get; set; }
    public DateTime FechaPago { get; set; }
}