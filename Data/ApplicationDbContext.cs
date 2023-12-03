using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using rodacini.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;//apărut după dbsets paste

namespace rodacini.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();//bm
        }
        public DbSet<Copac>? Copacs { get; set; } /*= null!;*///public DbSet<Pizza> Pizzas => Set<Pizza>();
        public DbSet<Functionar>? Functionars { get; set; } /*= null!;*/
        public DbSet<Padure>? Padures { get; set; } /*= null!;*/
        public DbSet<Parcea>? Parceas { get; set; } /*= null!;*/
        public DbSet<ApplicationUser>? AspNetUsers { get; set; } /*= null!;*///bm
        public DbSet<Loc>? Locs { get; set; }
        public DbSet<Uat>? Uats { get; set; }
    }
}