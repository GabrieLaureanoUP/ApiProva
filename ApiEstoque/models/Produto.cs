using System.ComponentModel.DataAnnotations;

namespace ApiEstoque.Models
{
    public class Produto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Nome { get; set; } 

        [Required]
        public int Quantidade { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Preco { get; set; }

        [MaxLength(200)]
        public string? Descricao { get; set; }
    }
}
