using ApiEstoque.Models;

namespace ApiEstoque.Routes
{
    public static class ROTA_DELETE
    {
        public static void MapDeleteRoutes(this WebApplication app)
        {
            app.MapDelete("/produtos/{id}", async (int id, ProdutoContext context) =>
            {
                var produto = await context.Produtos.FindAsync(id);

                if (produto is null) return Results.NotFound();

                context.Produtos.Remove(produto);

                await context.SaveChangesAsync();

                return Results.Ok();
            });
        }
    }
}