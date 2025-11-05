using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MimeKit;
using System.IO;
using System.Threading.Tasks;

namespace BusConnectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        [HttpPost("enviar")]
        public async Task<IActionResult> EnviarCorreo([FromForm] Models.Email request)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("BusConnect", "busconnectcorporacion2025@gmail.com"));
                message.To.Add(new MailboxAddress("", request.Destinatario));
                message.Subject = request.Asunto ?? "Tu boleto BusConnect";

                var builder = new BodyBuilder { TextBody = request.Mensaje ?? "Gracias por viajar con BusConnect." };

                if (request.Archivo != null && request.Archivo.Length > 0)
                {
                    using var stream = new MemoryStream();
                    await request.Archivo.CopyToAsync(stream);
                    builder.Attachments.Add(request.Archivo.FileName, stream.ToArray());
                }

                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync("busconnectcorporacion2025@gmail.com", "equj outy ykcw qqky");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return Ok(new { mensaje = "Correo enviado correctamente " });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = $"Error al enviar correo: {ex.Message}" });
            }
        }
    }

}

