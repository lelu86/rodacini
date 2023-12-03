using System.ComponentModel.DataAnnotations;

namespace rodacini.Models
{
    public class Parcea
    {
        //---------------------------
        public long ParceaId { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai perimetru")]
        public string? Perimetru { get; set; }//geojson
        //---------------------------
        [Required(ErrorMessage = "musai județ")]
        public string? Judet { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai ocol")]
        public string? Ocol { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai număr")]
        public string? Numar { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai capacitate")]
        public string? Capacitate { get; set; }
        //---------------------------
        public string? Nota { get; set; }
        //---------------------------
        [Required(ErrorMessage = "musai gata")]
        public bool? Gata { get; set; }//tre un algoritm care să verifice nivelul de umplere al parcelei,
                                       //căci pînă ajung funcționarii să o updateze ca gata userii vor tot planta
                                       //da poate nu mai este loc după normativele silvice.
                                       //btw, îmi tre o rază minimă între copaci, da fiecare specie are raza ei,
                                       //deci funcționarii tre să aibă parametrii ăștia în uzerul parcelei. 
                                       //voi avea un contdown și ceva artificii la ultimul copac plantat
        //---------------------------FK://și FK-urile tre să fie Required
        public Functionar? Functionar { get; set; }//FK //"Just make the FK property nullable can prevent cascade delete from happening"
    }
}
/*
 * ar trebui ca juridicii să poată completa parcele altfel voi avea multe începute de fizici cu doi tre copaci
 * care dupaia ca să se finalizese nu se va putea decît din contribuția completă romsilva
 * bun, deci ce completează juridicii va fi un poligon cu poza lor (înăutru poligonului, oricît de neregulat ar fi)
 * ce plantează fizicii vor fi puncte cu poza, iar dacă vreun fizic vrea să deseneze o inimioară gigant n-are decît
 * ps: plantarea se va face doar după ce se finalizează parcela în aplicație
 * nu va exista opțiunea alegerii speciei pt pădurile mixte căci există riscul să nu se planteze suficient de eterogen,
 * ideea e că silvicultorii știu la fața locului cum să amestece copacii, important e să aibă numărul
 * de asta îmi trebuie un preț unic la contribuție care să fie jumate din media ponderată(?) a tuturor speciilor
 * 
 * 
 * 
 * */