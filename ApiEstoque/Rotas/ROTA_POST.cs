using ApiEstoque.Models;

namespace ApiEstoque.Routes
{
    public static class ROTA_POST
    {        public static void MapPostRoutes(this WebApplication app)
        {
            app.MapPost("/api/produtos", async(Produto produto, ProdutoContext context) =>
            {
                context.Produtos.Add(produto);                await context.SaveChangesAsync();

                return Results.Created($"/api/produtos/{produto.Id}", produto);
            });
        }
    }
}