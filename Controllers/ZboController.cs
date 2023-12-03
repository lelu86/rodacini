using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using rodacini.Data;
using rodacini.Models;
using System.Collections;
using System.Diagnostics;

namespace rodacini.Controllers{
    [ApiController]
    [Route("[controller]")]
    public class ZboController:ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ZboController(ApplicationDbContext context, IHubContext<Viu> hubContext, UserManager<ApplicationUser> userManager/*bm*/)
        {
            _context = context;
        }
        //Loc---------------------
        [HttpPost("[action]")]
        public async Task<Object> Loc(NumeClasa numeObiect)
        {
            return await _context.Locs
                .Where(l => l.Nume.ToLower().StartsWith(numeObiect.numeProprietate.ToLower()) || l.NumeNormal.ToLower().StartsWith(numeObiect.numeProprietate.ToLower()))// nu-i soluție cu coloană normalizată căci dacă uzerul nu scrie nici 'barabant' nici 'bărăbanț' ci 'barabanț'?// le: îi clar că nu are cum și nici nu trebuie să existe o soluție în cazu ăsta, nici cu chained Replace(), printre care .Replace('ț','t'), căci dacă chiar există 'barabanț' în db?
                .Select(c => new { XcoorEpsg4326Wgs84 = c.XcoorEpsg4326Wgs84, YcoorEpsg4326Wgs84 = c.YcoorEpsg4326Wgs84, Nume = c.Nume, Uat = c.Uat, Judet = c.Judet })
                .Cast<Object>()
                .ToListAsync();
        }
        //Uat---------------------
        [HttpPost("[action]")]
        public async Task<Object> Uat(NumeClasa numeObiect)
        {
            return await _context.Uats
                .Where(l => l.Nume.ToLower().StartsWith(numeObiect.numeProprietate.ToLower()) || l.NumeNormal.ToLower().StartsWith(numeObiect.numeProprietate.ToLower()))// nu-i soluție cu coloană normalizată căci dacă uzerul nu scrie nici 'barabant' nici 'bărăbanț' ci 'barabanț'?// le: îi clar că nu are cum și nici nu trebuie să existe o soluție în cazu ăsta, nici cu chained Replace(), printre care .Replace('ț','t'), căci dacă chiar există 'barabanț' în db?
                .Select(c => new { /*Poligon = c.Poligon,*/ Nume = c.Nume, Judet = c.Judet })//se îneca dacă luam și poligoanele așa că am avut nevoie de încă un endpoint, "Uataleasa"
                .Cast<Object>()
                .ToListAsync();
        }
        //Uataleasa---------------------
        [HttpPost("[action]")]
        public async Task<Object> Uataleasa(NumeClasa2 numeObiect)
        {
            System.Diagnostics.Debug.WriteLine("???????????????????????????????????????????????????????????????");
            System.Diagnostics.Debug.WriteLine(numeObiect.numeProprietateNume);
            System.Diagnostics.Debug.WriteLine(numeObiect.numeProprietateJudet);
            System.Diagnostics.Debug.WriteLine("???????????????????????????????????????????????????????????????");
            return await _context.Uats
                .Where(l => l.Nume==numeObiect.numeProprietateNume && l.Judet==numeObiect.numeProprietateJudet)
                .Select(c => new { Poligon = c.Poligon, Nume = c.Nume, Judet = c.Judet })
                .Cast<Object>()
                .ToListAsync();
        }
        //Coo---------------------
        [HttpPost("[action]")]
        public async Task<Object> Coo(NumeClasa numeObiect)
        {
            return await _context.Locs
                .Where(l => l.Nume.ToLower().StartsWith(numeObiect.numeProprietate.ToLower()) || l.NumeNormal.ToLower().StartsWith(numeObiect.numeProprietate.ToLower()))// nu-i soluție cu coloană normalizată căci dacă uzerul nu scrie nici 'barabant' nici 'bărăbanț' ci 'barabanț'?// le: îi clar că nu are cum și nici nu trebuie să existe o soluție în cazu ăsta, nici cu chained Replace(), printre care .Replace('ț','t'), căci dacă chiar există 'barabanț' în db?
                .Select(c => new { XcoorEpsg4326Wgs84 = c.XcoorEpsg4326Wgs84, YcoorEpsg4326Wgs84 = c.YcoorEpsg4326Wgs84, Nume = c.Nume, Uat = c.Uat, Judet = c.Judet })
                .Cast<Object>()
                .ToListAsync();
        }
    }
}

public class NumeClasa
{
    public string numeProprietate { get; set; }
}

public class NumeClasa2
{
    public string numeProprietateNume { get; set; }
    public string numeProprietateJudet { get; set; }
}


