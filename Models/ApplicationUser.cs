using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rodacini.Models
{
    public class ApplicationUser : IdentityUser
    {
        //---------------------------
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]//nu se poate în sqlite, de așteptat, căci e doar un fișier din cîte știu, nu are db server, și totuși are căci ceva face cf link doi: https://stackoverflow.com/a/60677308  https://stackoverflow.com/a/53641061
        public long Numord { get; set; }//nu pot să-l incrementez din controller la loginul după înregistrare că nu-i garantată ordinea crescătoare așa, deci numai db tre să facă asta pt mine //chiar se pare că sqlite nu poate face autoincrement decît la pk
        //---------------------------
        //[Required(ErrorMessage = "uzeru zice: required, adică not null, deci fie true fie false")] //îi trimit valoare din angular da degeaba, se pare că dacă nu vine din razor nu are efect anotația [Required] 
        public bool? Supus { get; set; }//îmi tre supus pt register form că dacă schimb termenii și userul nu aceptă cu asta îi blochez accesul la tot saitul sau porțiuni
        //---------------------------
        public DateTime? Sters { get; set; }
        //---------------------------
        //[MaxLength(20)]
        public bool? Juridica { get; set; }//fizica, juridica. gospodar-ul și padurarii altundeva
        //---------------------------
        //[Required]//ăsta tre să fie conditional required doar dacă Tip==juridica, dar nu este așa ceva
        [FoolProof.Core.RequiredIf("Juridica", true)]
        public string? Cui { get; set; }
        //---------------------------
        public string? Poza { get; set; }
        //---------------------------
        //[MaxLength(50, ErrorMessage = "Numele nu poate fi mai lung de 50 caractere")]//orice caractere? căci ascii-urile au 8 biți or smth dar unele utf8-uri 32 or smth
        public string? Nume { get; set; }
        //---------------------------
        public int? Yob { get; set; }
        //---------------------------
        public string? Sex { get; set; }
        //---------------------------
        //[MaxLength(50, ErrorMessage = "Numele localității nu poate fi mai lung de 50 caractere")]
        public string? Localitate { get; set; }
        //---------------------------
        //[MaxLength(200, ErrorMessage = "Biografia nu poate fi mai lungă de 200 caractere")]
        public string? Bio { get; set; }
        //---------------------------
        public bool? Mailuri { get; set; }
        //---------------------------
        public string? Mina { get; set; }
        //---------------------------
        public string? Culoare { get; set; }
        //---------------------------
        public string? Pleaca { get; set; }
        //---------------------------
        public string? Razgindiri { get; set; }
        //---------------------------
        public string? Limba { get; set; }
        //---------------------------
        public bool? Limbuto { get; set; }
        //---------------------------
        public int Neplatiti { get; set; } = 0;
        //---------------------------
        public string? Medalion { get; set; }
        //---------------------------
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]//îmi trebuie Prl pt dto dar nu în db
        public string? Prl { get; set; }
        //---------------------------
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]//îmi trebuie Etc pt responses dar nu în db
        public string? Etc { get; set; }
    }
}