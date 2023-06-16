using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace rodacini//nu se poate fără namespace
{
    public class Viu:Hub
    {
        public async Task EmiteCopac(int nr) =>
        await Clients.All.SendAsync("nou", nr);
        public async Task EmiteCost(int nr) =>
        await Clients.All.SendAsync("cost", nr);
    }
}
