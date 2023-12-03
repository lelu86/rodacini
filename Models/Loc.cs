namespace rodacini.Models
{
    public class Loc
    {
        //---------------------------
        public long LocId { get; set; }
        //---------------------------
        public string? Nume { get; set; }
        //---------------------------
        public string? NumeNormal { get; set; }
        //---------------------------
        public string? Uat { get; set; }
        //---------------------------
        public string? UatNormal { get; set; }
        //---------------------------
        public string? Judet { get; set; }
        //---------------------------
        public string? JudetNormal { get; set; }
        //---------------------------
        public string? Xcoor { get; set; }//ar fi trebuit s-o numesc XcoorEpsg3844stereo70
        //---------------------------
        public string? Ycoor { get; set; }
        //---------------------------
        public string? XcoorEpsg4326Wgs84 { get; set; }//ol folosește "EPSG:3857 WGS 84 / Pseudo-Mercator"
        //---------------------------
        public string? YcoorEpsg4326Wgs84 { get; set; }
    }
}
