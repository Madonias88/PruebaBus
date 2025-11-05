using System;
using System.Collections.Generic;

namespace BusConnectAPI.Models
{
    public class ReservaRequest
    {
        public string Email { get; set; } = string.Empty;
        public CardInfo CardInfo { get; set; } = new CardInfo();
        public List<Pasajero> Passengers { get; set; } = new List<Pasajero>();

        // 🔹 Datos de viaje
        public int ViajeId { get; set; }      // ✅ NUEVO: se envía desde Angular
        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public string Bus { get; set; } = string.Empty;
    }

    public class CardInfo
    {
        public string CardNumber { get; set; } = string.Empty;
        public string Expiry { get; set; } = string.Empty;
        public string Cvv { get; set; } = string.Empty;
    }

    public class Pasajero
    {
        public string Nombre { get; set; } = string.Empty;
        public string Dpi { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        // 🔹 Identificadores del asiento
        public string Asiento { get; set; } = string.Empty; // puede ser "19" o "A19"
        public int AsientoId { get; set; }                // ✅ NUEVO: id exacto del asiento
    }
}
