using ApiEstoque.Models;
using Microsoft.EntityFrameworkCore;
using ApiEstoque.Routes;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

var builder = WebApplication.CreateBuilder(args);

// Configuração do banco SQLite
builder.Services.AddDbContext<ProdutoContext>(options =>
    options.UseSqlite("Data Source=estoque.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");

PopularBancoDeDados(app);

app.MapGetRoutes();
app.MapPostRoutes();
app.MapDeleteRoutes();

app.Run();

void PopularBancoDeDados (WebApplication app)
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<ProdutoContext>();

    context.Database.Migrate();

    if (!context.Produtos.Any())
    {

        var produtosIniciais = new List<Produto>
        {
            new Produto { Nome = "Teclado Mecânico", Quantidade = 15, Preco = 350.00m, Descricao = "Teclado mecânico RGB" },
            new Produto { Nome = "Mouse Gamer", Quantidade = 25, Preco = 220.00m, Descricao = "Mouse com alta precisão" },
            new Produto { Nome = "Monitor 24\"", Quantidade = 10, Preco = 950.00m, Descricao = "Monitor Full HD" },
            new Produto { Nome = "Headset", Quantidade = 30, Preco = 180.00m, Descricao = "Headset com microfone" },
            new Produto { Nome = "Cabo HDMI", Quantidade = 50, Preco = 40.00m, Descricao = "Cabo HDMI 2 metros" },
            new Produto { Nome = "SSD 1TB", Quantidade = 12, Preco = 700.00m, Descricao = "SSD NVMe rápido" },
            new Produto { Nome = "Placa de Vídeo", Quantidade = 5, Preco = 3200.00m, Descricao = "Placa de vídeo RTX 3060" },
            new Produto { Nome = "Fonte 600W", Quantidade = 20, Preco = 350.00m, Descricao = "Fonte ATX eficiente" },
            new Produto { Nome = "Gabinete", Quantidade = 18, Preco = 400.00m, Descricao = "Gabinete gamer" },
            new Produto { Nome = "Memória RAM 16GB", Quantidade = 22, Preco = 450.00m, Descricao = "Memória DDR4" }
        };

        context.Produtos.AddRange(produtosIniciais);
        context.SaveChanges();
    }
}
