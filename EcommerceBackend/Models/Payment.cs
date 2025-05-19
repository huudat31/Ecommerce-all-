using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models{
    [Table("Payments")]

    public class Payment{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id {get; set;}

        [Required]
        [ForeignKey("Order")]
        
        public int OrderId {get; set;}
        public Order? Order {get; set;}

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PaymentAmount {get; set;}

        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public string PaymentMethod {get; set;}

        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public string PaymentStatus {get; set;}

        [Required]
        [Column(TypeName = "nvarchar(255)")]
        public string TransactionId {get; set;}

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    }
}