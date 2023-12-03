using System.ComponentModel.DataAnnotations;

namespace rodacini.Models
{
    public class Copac
    {
        //---------------------------
        public long CopacId { get; set; }//"If you choose not to adopt the naming convention, the property must be annotated with the [Key]"
        //---------------------------
        [Required(ErrorMessage = "musai coordonate")]
        public string? Coordonate { get; set; }//grade N, grade E//ol e lot-lan, deci est-nord
        //---------------------------
        public string? NumeUzer { get; set; }//nu-mi folosește că dacă-și schimbă numele?
        //---------------------------
        //[Required(ErrorMessage = "musai moment")]//decomentez cînd fac o migrare-updatare
        public DateTime Moment { get; set; }//e required dar îl fac în controller că altfel cred că tre să-mi trimită spa-ul Moment-ul//le: pfff, nu cred că tre să trimită spa-ul momentul
        //---------------------------
        public string? Nota { get; set; }
        //---------------------------
        //[Required]//e required da numa după ce-l plantează pe teren. și mă rog, dacă-l plantează fără abatere atunci nu mai îi required
        public string? CoordonateFinale { get; set; }
        //---------------------------
        public /*bool*/string Platit { get; set; } = /*false*/"nu";//SQLite does not have a separate Boolean storage class. Instead, Boolean values are stored as integers 0 (false) and 1 (true) //deci fix invers, așa că să nu mă încurc folosesc 'da'/'nu'
        //---------------------------FK://și FK-urile tre să fie Required
        public Parcea? Parcea { get; set; }//FK
        //---------------------------FK://și FK-urile tre să fie Required
        public ApplicationUser? ApplicationUser { get; set; }//FK //"Just make the FK property nullable can prevent cascade delete from happening"
        //[Required] public ApplicationUser? Donator { get; set; }//nu merge așa, nu se poate fără FK. îmi dă There is already an object named 'AspNetRoles' in the database
    }
}


