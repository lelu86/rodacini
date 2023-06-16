using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using rodacini.Models;
using System.Diagnostics;
using rodacini.Data;

namespace rodacicni.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NumarCopacsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        int c;
        public NumarCopacsController(ApplicationDbContext context)
        {
            _context = context;
            c = _context.Copacs.Count();//am avut odată: Microsoft.Data.SqlClient.SqlException: 'Connection Timeout Expired.  The timeout period elapsed while attempting to consume the pre-login handshake acknowledgement.  This could be because the pre-login handshake failed or the server was unable to respond back in time.  The duration spent while attempting to connect to this server was - [Pre-Login] initialization=16832; handshake=0; '
        }

        [HttpGet]
        public int GetNumarCopacs()
        {
            return c;
        }
    }
}
