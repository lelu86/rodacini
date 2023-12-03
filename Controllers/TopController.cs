using Microsoft.AspNetCore.Authorization;
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
    public class TopController:ControllerBase
    {
        //static int c = 50;//"In C# you cannot define true global variables (in the sense that they don't belong to any class)"
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<Viu> _hubContext;
        private readonly UserManager<ApplicationUser> _userManager;/*bm*/
        int c;
        public TopController(ApplicationDbContext context, IHubContext<Viu> hubContext, UserManager<ApplicationUser> userManager/*bm*/)
        {
            _context = context;
            _hubContext = hubContext;
            _userManager = userManager;/*bm*/
            c = _context.Copacs.Count();//am avut aici la un gateway timeout: "Microsoft.Data.Sqlite.SqliteException: 'SQLite Error 5: 'unable to delete/modify user-function due to active statements'.'"
        }
        //Exemplu---------------------
        [HttpGet("[action]")]
        public async Task<int> Exemplu()
        {
            ApplicationUser uzer = await _userManager.GetUserAsync(HttpContext.User);
            return await _context.Copacs
                .Where(c => c.ApplicationUser.Nume == uzer.Nume)
                .CountAsync();
        }
        //TopUtilizatori---------------------
        [HttpGet("[action]")]
        public async Task<List<Object>> TopUtilizatori()
        {
            return await _context.Copacs
                //.Include("ApplicationUser")
                //.Where(c => c.CopacId != null)
                //.Select(c => new { c.Nota, c.ApplicationUser.Nume })
                .Where(c => c.ApplicationUser.Juridica == null)
                .Select(c => new {Poza=c.ApplicationUser.Poza, Nume = c.ApplicationUser.Nume, Palmares = _context.Copacs.Count(r => r.ApplicationUser.Nume == c.ApplicationUser.Nume) })
                .GroupBy(x => x)
                .OrderByDescending(x => x.Count())
                .Take(10)
                .Select(x => x.Key)
                .Cast<Object>()
                .ToListAsync();

            /*var copaci = await _context.Copacs.ToListAsync();
            return Ok(copaci);*/
        }
        //TopOrganizatii---------------------
        [HttpGet("[action]")]
        public async Task<List<Object>> TopOrganizatii()
        {
            return await _context.Copacs
                //.Include("ApplicationUser")
                //.Where(c => c.CopacId != null)
                //.Select(c => new { c.Nota, c.ApplicationUser.Nume })
                .Where(c => c.ApplicationUser.Juridica == true)
                .Select(c => new { Nume = c.ApplicationUser.Nume, Palmares = _context.Copacs.Count(r => r.ApplicationUser.Nume == c.ApplicationUser.Nume) })
                .GroupBy(x => x)
                .OrderByDescending(x => x.Count())
                .Take(10)
                .Select(x => x.Key)
                .Cast<Object>()
                .ToListAsync();

        }
    }
}
