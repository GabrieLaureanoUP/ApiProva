using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using ApiEstoque.Models;


namespace ApiEstoque.Routes
{
    public static class ROTA_GET 
    {        public static void MapGetRoutes(this WebApplication app)
        {
            app.MapGet("/", () => Results.Redirect("/produtos"));

            app.MapGet("/produtos", async (ProdutoContext context) =>
            {
                var produtos = await context.Produtos.ToListAsync();
                return Results.Ok(produtos);
            });

            app.MapGet("/produtos/{id}", async (int id, ProdutoContext context) =>
            {
                var produto = await context.Produtos.FindAsync(id);
                return produto is not null ? Results.Ok(produto) : Results.NotFound();
            });


        }
    }
}
