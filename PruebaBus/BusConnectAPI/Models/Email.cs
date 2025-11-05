namespace BusConnectAPI.Models
{
    public class Email
    {
        public string Destinatario { get; set; }
        public string Asunto { get; set; }
        public string Mensaje { get; set; }
        public Microsoft.AspNetCore.Http.IFormFile Archivo { get; set; }
    }
}
