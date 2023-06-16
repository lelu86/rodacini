using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace rodacini.Models
{
    public class ApplicationUser : IdentityUser
    {
        //---------------------------
        //SqlException: Cannot update identity column 'NrCrt'. //Microsoft.Data.SqlClient.SqlCommand+<>c.<ExecuteDbDataReaderAsync>b__188_0(Task<SqlDataReader> result)
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]//https://stackoverflow.com/questions/10427540/entity-framework-auto-incrementing-field-that-isnt-the-id
        //public long NrCrt { get; set; }//vreau să am evidența noilor utilizatori să pot oferi premi/felicitări utilizatorului cu nr 1000 spre exemplu. plus că-i bine să fie o cronologie//"You can't order a GUID column based on insertion order. You'll need to rely on another column". Nu pot folosi timestamp pt că "Be careful - a new timestamp value is assigned to a row on each insert and update"
        //---------------------------
        [Required(ErrorMessage = "modelu zice: required, adică not null, deci fie true fie false")]
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
        public byte[]? Poza { get; set; }//în angular tre să fac resize//
        //---------------------------
        [MaxLength(50, ErrorMessage = "Numele nu poate fi mai lung de 50 caractere")]//orice caractere? căci ascii-urile au 8 biți or smth dar unele utf8-uri 32 or smth
        public string? Nume { get; set; }
        //---------------------------
        public int? Yob { get; set; }
        //---------------------------
        public string? Sex { get; set; }
        //---------------------------
        [MaxLength(50, ErrorMessage = "Numele localității nu poate fi mai lung de 50 caractere")]
        public string? Localitate { get; set; }
        //---------------------------
        [MaxLength(200, ErrorMessage = "Biografia nu poate fi mai lungă de 200 caractere")]
        public string? Bio { get; set; }
        //---------------------------
        public bool? Mailuri { get; set; }
        //---------------------------
        public string? Mina { get; set; }
        //---------------------------
        public string? Paleta { get; set; }
    }
}