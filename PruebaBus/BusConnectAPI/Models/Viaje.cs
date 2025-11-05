using System.ComponentModel.DataAnnotations;

namespace BusConnectAPI.Models
{
    /// <summary>
    /// Modelo para representar un viaje en el sistema BusConnect.
    /// </summary>
    public class Viaje
    {
        /// <summary>
        /// ID único del viaje.
        /// </summary>
        [Required]
        public int ViajeId { get; set; }

        /// <summary>
        /// ID de la ruta asociada al viaje.
        /// </summary>
        [Required]
        public int RutaId { get; set; }

        /// <summary>
        /// ID del bus asignado al viaje.
        /// </summary>
        [Required]
        public int BusId { get; set; }

        /// <summary>
        /// Fecha y hora de salida del viaje.
        /// </summary>
        [Required]
        public DateTime FechaSalida { get; set; }

        /// <summary>
        /// Fecha y hora estimada de llegada del viaje.
        /// </summary>
        [Required]
        public DateTime FechaLlegadaEstimada { get; set; }

        /// <summary>
        /// Estado actual del viaje (ej. "EN PROGRAMA", "EN CURSO", etc.).
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Estado { get; set; } = string.Empty;
    }
}
