using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models{
    public class OrderDetail{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id {get; set;}

        [Required]
        [ForeignKey("Order")]
        public int OrderId {get; set;}
        public Order? Order {get; set;}

        [Required]
        [ForeignKey("Product")]
        public int ProductId {get; set;}
        public Product? Product {get; set;}

        [Required]
        [Column(TypeName = "int")]
        public int Quantity {get; set;}

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price {get; set;} // Price at the time of order

    }
}