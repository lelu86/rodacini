using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using rodacini.Models;
using rodacini.Data;
using System.Security.Policy;
using Azure;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Authentication;
using System.Reflection;
using Microsoft.AspNetCore.StaticFiles;

namespace rodacini.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UzerController : ControllerBase
    {
        protected readonly IWebHostEnvironment _environment;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private /*static*/ readonly HttpClient _clientEN;//static pt că ar fi bine o singură instanță de httpclient cred
        private /*static*/ readonly HttpClient _clientRO;
        public UzerController(
            IWebHostEnvironment environment, //dacă nu-i și aici am null exception on runtime
            SignInManager<ApplicationUser> signInManager, 
            UserManager<ApplicationUser> userManager, 
            ApplicationDbContext context, 
            HttpClient clientEN, 
            HttpClient clientRO)
        {
            _environment = environment;//dacă nu-i și aici am null exception on runtime
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
            _clientEN = clientEN;
            _clientEN = clientRO;
            _clientRO = clientRO;
        }
        [HttpPost("[action]")]
        public async Task</*string*/IActionResult> ProfPozaSus(/*[FromBody]*/ /*IFormFile Image*/)
        {
            if (!Request.Form.Files.Any())
                return BadRequest("No files found in the request");
            if (Request.Form.Files.Count > 1)
                return BadRequest("Cannot upload more than one file at a time");
            if (Request.Form.Files[0].Length <= 0)
                return BadRequest("Invalid file length, seems to be empty");
            try
            {
                string uploadsDir = Path.Combine(_environment.WebRootPath, "profpoze");
                if (!Directory.Exists(uploadsDir))
                    Directory.CreateDirectory(uploadsDir);// wwwroot/profpoze/
                IFormFile file = Request.Form.Files[0];
                var uzer = await _userManager.GetUserAsync(HttpContext.User);
                string fileName = uzer.Id+".png";//musai extensie pt ng or html or wathewer //nu contează că încarc jpg sau alt tip, aici ajunge ceva base64 or smth //dacă e același nume îi face override cea cei bine
                string fullPath = Path.Combine(uploadsDir, fileName);
                var buffer = 1024 * 1024;
                using var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, buffer, useAsync: false);
                await file.CopyToAsync(stream);
                await stream.FlushAsync();
                var result = new{message = "Upload successful",};
                return Ok(result);//la Ok nu merge direct "Upload successful"
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Upload failed: " + ex.Message);
            }
        }
        [HttpPost("[action]")]
        public async Task<ApplicationUser> Inregistrare(ApplicationUser uzer)
        {
            uzer.Limbuto = uzer.Limbuto;//nu-i musai pt ca să nu dispară limbuto după înregistrare da îl las ca să-mi fie dto-ul returnat cît mai aproape de uzer-ul din db
            uzer.Numord = _context.AspNetUsers.Count()+1;//nota de subsol 1
            uzer.UserName = uzer.Email;//cînd înregistrarea era din razor nu era niciun bai, acum fără am "Username '' is invalid, can only contain letters or digits."
            if (uzer.Juridica==false /*&& uzer.Nume == null*/)//null nu ""
            {
                System.Diagnostics.Debug.WriteLine("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
                uzer.Nume = "anon"+Convert.ToString(_context.AspNetUsers.Count() + 1);
            }
            if (uzer.Juridica==true /*&& uzer.Nume == null*/)//null nu ""
            {
                System.Diagnostics.Debug.WriteLine("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
                uzer.Etc = "denumirea este obligatorie";
                return uzer;
            }
            if (await _userManager.FindByEmailAsync(uzer.Email) != null) //jesus, fără await îmi returna true tot timpul căci de fapt returna Task<> or smth //e ok și fără căci îmi zice Identity sau cineva: "Username 'u1@mail.com' is already taken."
            {
                uzer.Nume = null;
                uzer.Email = null;
                //uzer.Etc=$"{uzer.Email} <-- această adresă e folosită deja";
                uzer.Etc = $"această adresă e folosită deja";
                return uzer;
            }
            var responseEN = await _clientEN.GetAsync("https://api.dictionaryapi.dev/api/v2/entries/en/" + uzer.Prl);
            var responseRO = await _clientRO.GetAsync("https://dexonline.ro/definitie/" + uzer.Prl + "/json");
            var jsonResponseRO = responseRO.Content.ReadAsStringAsync().Result;
            var resultJsonResponseRO = JObject.Parse(jsonResponseRO);
            if (uzer.Prl.Length < 8 || uzer.Prl == uzer.Email || uzer.Prl == uzer.Nume || (int)responseEN.StatusCode == 200 || resultJsonResponseRO["definitions"].HasValues)
            {
                uzer.Nume = null;
                uzer.Prl = null;
                uzer.Etc = $"parola trebuie să aibă minim opt caractere,\nsă nu fie un cuvînt englez, maghiar(todo) sau romîn\nși să nu fie emailul sau numele";
                return uzer;
            }
            //if 
            /*var result =*/ await _userManager.CreateAsync(uzer, uzer.Prl);//ApplicationUser.Prl e [NotMapped] deci nu bag parole în db
            uzer.Etc = $"înregistrat cu succes.\nparola e conservată cu sare și haș, nimeni nu o poate vedea\ndar ar fi bine să o schimbi din cînd în cînd";
            return uzer;
            //if (!result.Succeeded)
            //{
            //var errors = result.Errors.Select(e => e.Description);
            //System.Diagnostics.Debug.WriteLine("catPOST-------------------", errors);
            //return BadRequest(new { Errors = errors });
            //}
            //signin after signup:
            //var intraresult = await _signInManager.PasswordSignInAsync(uzer.UserName, uzer.Prl, /*model.RememberMe*/true, lockoutOnFailure: true);
            //if (!intraresult.Succeeded)//mai este IsLockedOut, IsNotAllowed și altele
            //{
            //return BadRequest("login after signin no mers");
            //}
            //return await "---------201---------";
            //return StatusCode(201, "înregistrat cu succes.\nparola e conservată cu sare și haș, nimeni nu o poate vedea\ndar ar fi bine să o schimbi din cînd în cînd\ncăci dacă cineva copiază handshakeul și își încearcă norocul\npoate chiar nimerește\n&#9988;---------------------------\nstatus 201 resursă creată. înregistrat în db. nimeni nu poate vedea parola, dar alte date personale nu-s criptate. dacă ar fi criptate toate ar mai fi nevoie de consimțămînt gdpr?");//"the request has succeeded and has led to the creation of a resource"
        }
        [HttpGet("[action]")]//nu-i nevoie de decorator dacă numele e "GetMyFun" //păstrez pt rută //pot scrie "orice"
        public async Task<ApplicationUser> Uzer()
        {
            return await _userManager.GetUserAsync(HttpContext.User);//HttpContext nu merge oriunde: "Importantly, the code where you're using this must be within the request pipeline in some way or HttpContext will be null"
        }
        public class Gdpr{public string email{get;set;} public string hash{get;set;} public string nume{get;set;} public string poza{get;set;}}
        [HttpGet("[action]")]
        public async Task<Gdpr> Ggdpr()
        {
            var uzer = await _userManager.GetUserAsync(HttpContext.User);
            Gdpr gdpr = new Gdpr();
            gdpr.email = uzer.Email;
            gdpr.hash = uzer.PasswordHash;
            gdpr.nume = uzer.Nume;//gdpr.localitate nu căci nu poate exista o localitate cu un singur om, cred
            if(uzer.Poza != null)
            {
                gdpr.poza = uzer.Poza;
            }
            System.Diagnostics.Debug.WriteLine("===================================================");
            System.Diagnostics.Debug.WriteLine(gdpr);//e ok chiar dacă printează: rodacini.Controllers.UzerController+Gdpr
            System.Diagnostics.Debug.WriteLine("===================================================");
            return gdpr;
        }
        [HttpPost("[action]")]
        public async Task</*string*/ApplicationUser>/*<IActionResult>*/ Intrare(ApplicationUser uzer)//păstrez <string> ca exemplu, vezi și în frontend. așa nu aș fi avut nevoie de improvizația .Etc, totuși cînd tre să response pe bune un uzer plus un response îmi prinde bine .Etc
        {
            //System.Diagnostics.Debug.WriteLine(":::::::::::::::::::::::::::", uzer.Email);
            var intraresult = await _signInManager.PasswordSignInAsync(uzer.Email, uzer.Prl, /*model.RememberMe*/true, lockoutOnFailure: true);
            //todo if uzer.email not in db și if uzer.prl != uzer.prl din db
            if (!intraresult.Succeeded)
            {
                uzer.Etc = "intrare eșuată";
                return uzer;
            }
            uzer.Etc = "intrare reușită";
            return uzer;
        }
        [HttpGet("[action]")]
        public async Task/*<IActionResult>*/ Iesire()
        {
            await _signInManager.SignOutAsync();//se poate și direct HttpContext.SignOutAsync da ăsta cică știe mai multe
            /*if (await _userManager.GetUserAsync(HttpContext.User) == null)
            {
                return BadRequest("delogarea no mers");
            }
            //return StatusCode(200, "delogat cu succes\n&#9988;---------------------------\ne ok");
            return Ok("delogat cu succes\n&#9988;---------------------------\ne ok");*/
        }
        [HttpPut("[action]")]
        public async Task<ApplicationUser>/*<IActionResult>*/ ProfPref(ApplicationUser uzer)
        {//am încercat cu reflexivitate da e încurcată plus că dacă tre să adaug ceva aici la cutare proprietate tot trebuie să mă ocup de ea separat
            /*if (uzer.Etc == "stergePoza")
            {
                string fileName = uzer.Id + ".png";
                string uploadsDir = Path.Combine(_environment.WebRootPath, "profpoze");
                string fullPath = Path.Combine(uploadsDir, fileName);
                System.IO.File.Delete(fullPath);//nu există async pt delete: https://stackoverflow.com/questions/68813792
                uzer.Etc = "";
            }*/
            //if (System.Text.RegularExpressions.Regex.IsMatch(uzer.Nume, @"\banon[0-9]*\b") && uzer.Nume != "anon" + Convert.ToString(_context.AspNetUsers.Count()))// @"\banon[0-9]*\b" match anon și anon plus orice cifrăși număr ca sufix // @ e ca să nu se escapeze nimic
            if (System.Text.RegularExpressions.Regex.IsMatch(uzer.Nume, @"\banon[0-9]*\b") && uzer.Nume != "anon" + Convert.ToString(uzer.Numord))
            {
                uzer.Etc = "conbinația anon+număr\ne generată automat";
                //uzer.Nume = "anon" + Convert.ToString(_context.AspNetUsers.Count());
                uzer.Nume = "anon" + Convert.ToString(uzer.Numord);
                return uzer;
            }
            ApplicationUser cuzer = await _userManager.GetUserAsync(HttpContext.User);
            System.Diagnostics.Debug.WriteLine("ooooooooooooooooooooooooooo");
            System.Diagnostics.Debug.WriteLine(cuzer.Medalion);
            System.Diagnostics.Debug.WriteLine(uzer.Medalion);
            System.Diagnostics.Debug.WriteLine("ooooooooooooooooooooooooooo");
            if (cuzer.Poza != uzer.Poza)
            {
                cuzer.Poza = uzer.Poza;
            }
            if (cuzer.Nume != uzer.Nume && uzer.Nume != null)//uzer.Nume != "" înșală
            {
                cuzer.Nume = uzer.Nume;
            }
            if (cuzer.Yob != uzer.Yob)
            {
                cuzer.Yob = uzer.Yob;
            }
            if (cuzer.Sex != uzer.Sex)
            {
                cuzer.Sex = uzer.Sex;
            }
            if (cuzer.Localitate != uzer.Localitate)
            {
                cuzer.Localitate = uzer.Localitate;
            }
            if (cuzer.Bio != uzer.Bio)
            {
                System.Diagnostics.Debug.WriteLine("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                cuzer.Bio = uzer.Bio;
            }
            if (cuzer.Mailuri != uzer.Mailuri)
            {
                cuzer.Mailuri = uzer.Mailuri;
            }
            if (cuzer.Mina != uzer.Mina)
            {
                cuzer.Mina = uzer.Mina;
            }
            if (cuzer.Culoare != uzer.Culoare)
            {
                cuzer.Culoare = uzer.Culoare;
            }
            if (cuzer.Pleaca != uzer.Pleaca)
            {
                cuzer.Pleaca = uzer.Pleaca;
            }
            if (cuzer.Razgindiri != uzer.Razgindiri)
            {
                cuzer.Razgindiri = cuzer.Razgindiri + uzer.Razgindiri + "_";//vreau să țin evidența și vreau un separator ca să am un fel de array. Prin 2010 sqlite nu suporta array și chiar dacă acum poate suportă sigur apar complicații, deci rămîn la string
            }
            if (cuzer.Limba != uzer.Limba)
            {
                cuzer.Limba = uzer.Limba;
            }
            if (cuzer.Limbuto != uzer.Limbuto)
            {
                cuzer.Limbuto = uzer.Limbuto;
            }
            if (cuzer.Medalion != uzer.Medalion)
            {
                System.Diagnostics.Debug.WriteLine("+++++---------------+++++++++++++++----------");
                cuzer.Medalion = uzer.Medalion;
                System.Diagnostics.Debug.WriteLine("+++++---------------+++++++++++++++----------");
            }
            /*var result =*/
            await _userManager.UpdateAsync(cuzer);
            uzer.Etc = "salvat cu succes";
            return uzer;
            /*if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }
            return StatusCode(204, "actualizat cu succes\n&#9988;---------------------------\nstatus 204 no content to return cică e potrivit pt PUT");*/
        }
    }
}

/*
1: mă gîndesc că ce-am scris în model rămîne valabil.
Scenariu: am 77 uzeri.
Al 78-ulea trimite request.
Request ajunge la controller.
Controlleru assignează 77+1 la numord.
Pînă cînd CreateAsync îl scrie în db trec 2sec
Al 79-lea trimite request.
Request ajunge la controller.
Controlleru assignează 77+1 la numord.
Pînă cînd CreateAsync îl scrie în db trece 1sec
dacă fac un check înainte să scriu în db tot nu-i ok căci chiar dacă checkul e sincron are loc într-o fcț async
SINGURA SOLUȚIE O FI SĂ PREPOPULEZ COLOANA NUMORD DA !?!NU SE POATE!?!
*/