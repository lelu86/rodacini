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
    public class CopacController:ControllerBase
    {
        //static int c = 50;//"In C# you cannot define true global variables (in the sense that they don't belong to any class)"
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<Viu> _hubContext;
        private readonly UserManager<ApplicationUser> _userManager;/*bm*/
        int c;
        public CopacController(ApplicationDbContext context, IHubContext<Viu> hubContext, UserManager<ApplicationUser> userManager/*bm*/)
        {
            _context = context;
            _hubContext = hubContext;
            _userManager = userManager;/*bm*/
            c = _context.Copacs.Count();//am avut aici la un gateway timeout: "Microsoft.Data.Sqlite.SqliteException: 'SQLite Error 5: 'unable to delete/modify user-function due to active statements'.'"
        }
        //Palmares---------------------
        [HttpGet("[action]")]
        public async Task<int> Palmares()
        {
            ApplicationUser uzer = await _userManager.GetUserAsync(HttpContext.User);
            if (uzer != null)
            {
                return await _context.Copacs
                .Where(c => c.ApplicationUser.Nume == uzer.Nume)
                .CountAsync();// înainte de if am avut de două ori (prima nu știu da a doua oară după delogare) System.NullReferenceException: 'Object reference not set to an instance of an object.'
            }
            return 0;
        }
        //Create---------------------
        [HttpPost]
        //[Authorize/*(Policy = "Fizica")*/]
        public async Task<IActionResult> PostCopac(Copac copac/*, ApplicationUser appuser*/)//[FromBody] e apă sfințită da dacă ceva nu-i ok testează cu el decomentat //public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Ok("nelogat,\nneplantat");
            }
            //ApplicationUser uzer = await _userManager.FindByNameAsync(_httpContextAccessor.HttpContext.User.Identity.Name);
            //nu are rost și o fi mai sigur să iau uzeru din HttpContext decît din frontend
            ApplicationUser appuser = await _userManager.GetUserAsync(HttpContext.User);//bm //merge și cu var în loc de ApplicationUser
            string numaNume = appuser.Email.Split('@').First();//"string is an alias in C# for System.String. So technically, there is no difference. It's like int vs. System.Int32"
            //if (uzer.Tip != "fizica" && uzer.Tip != "juridica") return Forbid("doar persoanele fizice pot planta cîte un copac, persoanele juridice plantează o parcelă");/*bm*/
            copac.NumeUzer = appuser.Nume;//nu-mi folosește că dacă-și schimbă numele?
            copac.Moment = DateTime.UtcNow;
            copac.ApplicationUser = appuser;//asta nu-mi mai trebe nu?
            await _context.Copacs.AddAsync(copac);//_context.TodoItems.Add(todoItem);
            appuser.Neplatiti = appuser.Neplatiti + 1;
            await _context.SaveChangesAsync();
            c++;
            await _hubContext.Clients.All.SendAsync("nou", c);
            //return Ok("Am plantat copacul în baza de date.&#10;În curînd și pe teren.");
            //return Ok("Am plantat copacul în baza de date.&#13;În curînd și pe teren.");
            //return Ok("Am plantat copacul în baza de date.<pre>În curînd și pe teren.");
            //return Ok($"Am plantat copacul în baza de date.{Environment.NewLine}În curînd și pe teren.");//return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);//"Returns an HTTP 201 status code if successful. HTTP 201 is the standard response for an HTTP POST method"
            return Ok("Am plantat copacul în baza de date.\nÎn curînd și pe teren.");
        }
        //Read---------------------
        //[HttpGet]
        //public async Task/*<ActionResult<IEnumerable<Copac>>>*/ GetCopacs()//public async Task<IActionResult> GetCopacs()
        public async Task<List<Object>> GetCopacs()//dacă e singurul 'get all' pot șterge [HttpGet] dar numele musai cu prefix Get, eg GetCopacs //dacă am mai multe 'get all' voi pune [HttpGet("[action]")] la celălalte, ca la UzerController
        {
            return await _context.Copacs
                //.Include("ApplicationUser")//include tot //rămîne ca exemplu
                //.Where(c => c.CopacId != null)//rămîne ca exemplu
                //.Select(c => new { c.Nota, c.ApplicationUser.Nume })//tre dto sau cast to Object //rămîne ca exemplu
                .Select(c => new {Nota=c.Nota, Coordonate=c.Coordonate, Nume=c.ApplicationUser.Nume, Medalion=c.ApplicationUser.Medalion, Platit=c.Platit})//NU ȘTERGE CHIAR DACĂ-I GRI!!!
                .Cast<Object>()
                .ToListAsync();//https://stackoverflow.com/a/44684617 //singura variantă fără dto //pt "paginare": https://stackoverflow.com/questions/69736465/
            /*var copaci = await _context.Copacs.ToListAsync();
            return Ok(copaci);*/
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Copac>> GetCopac(long id)//nu merge Task<IActionResult>
        {
            var copac = await _context.Copacs.FindAsync(id);
            if (copac == null)
            {
                return NotFound("copacu ăsta no fo plantat vreodată în baza de date. Sau poate o fo dezrădăcinat?");
            }
            return copac;
        }
        //Update---------------------
        [HttpPut("{id}")]//PATCH mai degrabă
        [Authorize(Policy = "Padurar")]
        public async Task<IActionResult> PutCopac(long id, Copac copac)//pt locația finală, updatat de către romsilva
        {
            /*if (! HttpContext.User.HasClaim("Padurar", bool.TrueString))
            {
                return Forbid();
            }*/
            if (id != copac.CopacId)
            {
                return BadRequest();
            }
            _context.Entry(copac).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                /*if (!TodoItemExists(id))*/
                if (!_context.Copacs.Any(e => e.CopacId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();//nu pot returna string gen "cred că am updatat copacul"
            /*_context.Copacs.Update(copac);
            await _context.SaveChangesAsync();
            return Ok();*/
        }
        //Delete---------------------
        [HttpDelete("{id}")]//asta doar dacă am money back policy înainte de a fi fizic plantat. Nu șterg dacă userul își șerge contul. Atenție la cascade delete căci e true by default
        [Authorize]
        public async Task<IActionResult> DeleteCopac(long id)
        {
            var copac = await _context.Copacs.FindAsync(id);
            if (copac == null)
            {
                return NotFound();
            }
            _context.Copacs.Remove(copac);
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("nou", c--);
            return NoContent();
            //return Ok("Copacul a fost dezrădăcinat din baza de date");
        }
        //NumarCopacs---------------------
        [HttpGet("[action]")]
        public async Task<int> NumarCopacs()//nu se plînge dacă nu-i async
        {
            return _context.Copacs.Count();
        }
        /*private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }*/
    }
}
//https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?WT.mc_id=dotnet-35129-website&view=aspnetcore-6.0&tabs=visual-studio
