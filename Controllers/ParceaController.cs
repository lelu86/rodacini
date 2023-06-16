using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rodacini.Data;
using rodacini.Models;

namespace rodacini.Controllers{
    [ApiController]
    [Route("[controller]")]
    public class ParceaController:ControllerBase
    {
        private readonly ApplicationDbContext _context;
        //public bool IsPadurar => HttpContext.User.HasClaim("Padurar", bool.TrueString);
        public ParceaController(ApplicationDbContext context)
        {
            _context = context;
        }
        //Create---------------------
        [HttpPost]
        [Authorize/*(Policy = "Padurar")*/]
        public async Task<IActionResult> PostParcela(Parcea parcea)//public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
        {
            //if (!IsPadurar) return Forbid();
            /*if (!HttpContext.User.HasClaim("Fizica", bool.TrueString)){
                return Forbid();
            }*/
            await _context.Parceas.AddAsync(parcea);//_context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();
            return Ok("Parcela a fost introdusă în baza de date.");//return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);//"Returns an HTTP 201 status code if successful. HTTP 201 is the standard response for an HTTP POST method"
        }
        //Read---------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Parcea>>> GetParceas()//public async Task<IActionResult> GetParceas()
        {
            return await _context.Parceas.ToListAsync();
            /*var parceas = await _context.Parceas.ToListAsync();
            return Ok(parceas);*/
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Parcea>> GetParcea(long id)//nu merge Task<IActionResult>
        {
            var parcea = await _context.Parceas.FindAsync(id);
            if (parcea == null)
            {
                return NotFound("parcela aceasta nu există în baza de date");
            }
            return parcea;
        }
        //Update---------------------
        [HttpPut("{id}")]//PATCH mai degrabă
        [Authorize(Policy = "Padurar")]
        public async Task<IActionResult> PutParcea(long id, Parcea parcea)//pt locația finală, updatat de către romsilva
        {
            if (! HttpContext.User.HasClaim("Padurar", bool.TrueString))
            {
                return Forbid();
            }
            if (id != parcea.ParceaId)
            {
                return BadRequest();
            }
            _context.Entry(parcea).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                /*if (!TodoItemExists(id))*/
                if (!_context.Parceas.Any(e => e.ParceaId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();//nu pot returna string gen "parcela a fost updatată, sper"
            /*_context.Parceas.Update(parcea);
            await _context.SaveChangesAsync();
            return Ok();*/
        }
        //Delete---------------------
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteParcea(long id)
        {
            var parcea = await _context.Parceas.FindAsync(id);
            if (parcea == null)
            {
                return NotFound();
            }
            _context.Parceas.Remove(parcea);
            await _context.SaveChangesAsync();
            return NoContent();
            //return Ok("Parcela a fost ștearsă din baza de date");
        }
        /*private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }*/
    }
}
//https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?WT.mc_id=dotnet-35129-website&view=aspnetcore-6.0&tabs=visual-studio
