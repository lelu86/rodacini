using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;//Newtonsoft.Json e prost da dacă îl am la imports e folosit el nu System.Text.Json 
using rodacini.Data;
using rodacini.Models;
using Stripe;
using System.Collections;
using System.Diagnostics;
using System.Reflection.Metadata;

namespace rodacini.Controllers{
    [ApiController]
    [Route("[controller]")]
    public class PlataController:Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        int c;
        private readonly IWebHostEnvironment _hostingEnvironment;

        ApplicationUser uzer;
        public PlataController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _userManager = userManager;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost("[action]")]
        public ActionResult Plateste(Nimic nimic)//nu merge get de asta am nevoie de Nimic
        {
            string jsonString = System.IO.File.ReadAllText(Path.Combine(_hostingEnvironment.WebRootPath, "contributia.json"));
            Contributia contributia = JsonSerializer.Deserialize<Contributia>(jsonString)!;
            ApplicationUser appuser = _userManager.GetUserAsync(HttpContext.User).GetAwaiter().GetResult();
            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
            {
                Amount = appuser.Neplatiti * Convert.ToInt32(contributia.contributia) * 100,//ron minim 1*200 la 29-09-2023 ~23:50 //usd minim 1*43 la 30-09-2023_00:00 +-30sec
                Currency = "ron",
            });
            return Json(new { client_secret = paymentIntent.ClientSecret });
        }

        [HttpGet("[action]")]
        public ActionResult Platit()
        {
            ApplicationUser appuser = _userManager.GetUserAsync(HttpContext.User).GetAwaiter().GetResult();
            appuser.Neplatiti=0;
            foreach(var i in _context.Copacs)
            {
                if (i.Platit == "nu")
                {
                    i.Platit = "da";
                }
            }
            _context.SaveChanges();
            return Ok();
        }

        public class Nimic
        {
        }
        public class Contributia
        {
            public int? contributia { get; set; }
        }
    }
}

