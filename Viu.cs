using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace rodacini//nu se poate fără namespace
{
    public class Viu:Hub
    {
        public static IHubContext<Viu> GlobalContext { get; private set; }//bm
        public Viu(IHubContext<Viu> ctx) {
            GlobalContext = ctx;
        }//bm
        public async Task EmiteCopac(int nr) =>
        await Clients.All.SendAsync("nou", nr);
        public async Task EmiteContributia(int nr) =>
        await Clients.All.SendAsync("contributia", nr);
    }
}
