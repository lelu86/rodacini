using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using rodacini.Models;
using System.Diagnostics;

namespace rodacini.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UzerNumeMailController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public UzerNumeMailController(UserManager<ApplicationUser> userManager/*bm*/)
        {
            _userManager = userManager;/*bm*/
        }

        [HttpGet]
        public async Task<string> GetUzerNumeMail()
        {
            ApplicationUser uzer = await _userManager.GetUserAsync(HttpContext.User);
            string numaNume;
            if (uzer != null)
            {
                Debug.WriteLine("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                Debug.WriteLine(uzer.Email);
                Debug.WriteLine("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
                numaNume = uzer.Email.Split('@').First();//"string is an alias in C# for System.String. So technically, there is no difference. It's like int vs. System.Int32"
                return numaNume;
            }
            return "nelogat";
        }
    }
}
