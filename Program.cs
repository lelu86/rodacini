using Microsoft.EntityFrameworkCore;
using FoolProof.Core;//bm
using rodacini.Data;
using rodacini.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.SignalR;
using rodacini;
using Stripe;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";//bm pt ol VectorSource url

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
var dataSource = Path.Combine(((IWebHostEnvironment)builder.Environment).WebRootPath, "db/rodacinisqlite.db");//bm
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options./*UseSqlServer*/UseSqlite(/*connectionString*/$"Data Source={dataSource};"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false/*true*/)//false bm
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

builder.Services.AddFoolProof();//bm
builder.Services.AddSignalR();//bm
builder.Services.AddHttpClient();//bm //fără am: HttpErrorResponse {headers: HttpHeaders, status: 500, statusText: 'Internal Server Error', url: 'https://localhost:44400/uzer/uzer', ok: false, …}

builder.Services.Configure<IdentityOptions>(o =>
{
    //o.Password.RequiredLength = 8;
    o.Password.RequireNonAlphanumeric = false;
    o.Password.RequireDigit = false;
    //o.Password.RequireLowercase = true;
    o.Password.RequireUppercase = false;
});//bm

builder.Services.AddCors(options =>//fără am: Access to XMLHttpRequest at 'https://localhost:7113/parceas.json' from origin 'https://localhost:44400' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
{
    options.AddPolicy(MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins(
            "https://rodacini.ro",
            "https://rodacini.onrender.com",
            "https://localhost:44400",
            "https://localhost:7113"
            //"*"
            )
                //.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});//bm pt ol VectorSource url

////////////////////////////////////////////////
StripeConfiguration.ApiKey = "sk_test_v0rQRqenSs7uso5uewLvjI7b00A9HmbCmN";
void Configure(IApplicationBuilder app, IWebHostEnvironment env){StripeConfiguration.ApiKey = "sk_test_v0rQRqenSs7uso5uewLvjI7b00A9HmbCmN";}
////////////////////////////////////////////////

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
    app.UseDeveloperExceptionPage();//bm //da cică din motive de securitate nu arată stack trace-ul în production
    app.UseExceptionHandler("/Error");//bm
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseDeveloperExceptionPage();//bm //da cică din motive de securitate nu arată stack trace-ul în production
    app.UseExceptionHandler("/Error");//bm
}

app.UseCors(MyAllowSpecificOrigins);//bm pt ol VectorSource url
//cbm app.UseHttpsRedirection();
app.UseStaticFiles();

//app.UseAuthentication();//bm
//app.UseAuthorization();//bm

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.MapHub<rodacini.Viu>("/rutaviu");//bm

//var watcher = new FileSystemWatcher(System.Reflection.Assembly.GetExecutingAssembly().CodeBase);//rămîne//The directory name 'file:///C:/Users/lel/source/repos/rodacini/bin/Debug/net8.0/rodacini.dll' does not exist
//var watcher = new FileSystemWatcher(@"C:\Users\lel\source\repos\rodacini\wwwroot");//rămîne
var watcher = new FileSystemWatcher(app.Environment.WebRootPath);
//watcher.NotifyFilter = NotifyFilters.Attributes| NotifyFilters.CreationTime| NotifyFilters.DirectoryName| NotifyFilters.FileName| NotifyFilters.LastAccess| NotifyFilters.LastWrite| NotifyFilters.Security| NotifyFilters.Size;//rămîne
watcher.Deleted += OnDeleted;
watcher.Filter = "contributia.json";
watcher.IncludeSubdirectories = true;//rămîne
watcher.EnableRaisingEvents = true;//rămîne

void OnDeleted(object sender, FileSystemEventArgs e)//pt inginerii vieții on-delete e on-modified pt muritori
{
    Console.WriteLine("CdCdCdCdCdCdCdCdCd");//rămîne
    System.Diagnostics.Debug.WriteLine("DdDdDdDdDdDdDdDdDd");//rămîne
    Console.WriteLine($"Deleted: {e.FullPath}");//rămîne
    string jsonString = System.IO.File.ReadAllText(Path.Combine(app.Environment.WebRootPath,"contributia.json"));
    Contributia contributia = JsonSerializer.Deserialize<Contributia>(jsonString)!;
    Viu.GlobalContext.Clients.All.SendAsync("contributia", contributia.contributia);//este cînd am de la început și nu trece could not find client method with name contributia or smth
}
////////////////////////////////////////////////
StripeConfiguration.ApiKey = "sk_test_51NuG4sIvOzFkCYHSN1SGdU4miG0E30jZpPYJo9etFQHRaEVabNFy2xP02DVlUhVeULLO2fRf6u6VLH38Sx4QenFc00ZEUg8CWY";
//void Configure(IApplicationBuilder app, IWebHostEnvironment env) { StripeConfiguration.ApiKey = "sk_test_v0rQRqenSs7uso5uewLvjI7b00A9HmbCmN"; }
////////////////////////////////////////////////
app.Run();

public class Contributia
{
    public int? contributia { get; set; }
}
