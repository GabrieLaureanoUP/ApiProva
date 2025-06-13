using ApiEstoque.Models;

namespace ApiEstoque.Routes
{
    public static class ROTA_PUT
    {        public static void MapPutRoutes(this WebApplication app)
        {
            app.MapPut("/api/produtos/{id}", async (int id, Produto produtoAtualizado, ProdutoContext context) =>
            {
                var produto = await context.Produtos.FindAsync(id);

                if (produto is null) return Results.NotFound();

                produto.Nome = produtoAtualizado.Nome;
                produto.Quantidade = produtoAtualizado.Quantidade;
                produto.Preco = produtoAtualizado.Preco;
                produto.Descricao = produtoAtualizado.Descricao;

                await context.SaveChangesAsync();

                return Results.Ok(produto);
            });
        }
    }
}
