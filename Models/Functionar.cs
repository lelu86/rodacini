using System.ComponentModel.DataAnnotations;

namespace rodacini.Models
{
    public class Functionar
    {
        //---------------------------
        public long FunctionarId { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai nume")]
        public string? Nume { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai parolă")]
        public string? Parola { get; set; }
    }
}
