using System.ComponentModel.DataAnnotations;

namespace rodacini.Models
{
    public class Padure
    {
        //---------------------------
        public long PadureId { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai perimetru")]
        public string? Perimetru { get; set; }//geojson
        //---------------------------
        public DateTime Moment { get; set; }
        //---------------------------
        public string? Nota { get; set; }
        //---------------------------FK://și FK-urile tre să fie Required
        public Parcea? Parcea { get; set; }//FK //cică nu tre [Required] din moment ce FK e Parcea's PK care e un non-nulable type
        //---------------------------FK://și FK-urile tre să fie Required
        public ApplicationUser? ApplicationUser { get; set; }//FK //"Just make the FK property nullable can prevent cascade delete from happening"
        //[Required] public ApplicationUser? Donator { get; set; }//nu merge așa, nu se poate fără FK. îmi dă There is already an object named 'AspNetRoles' in the database
    }
}
