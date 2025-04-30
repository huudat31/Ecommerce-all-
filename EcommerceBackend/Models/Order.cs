using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Models{
    [Table("Orders")]
    public class Order{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id {get; set;}

        [Required]
        [ForeignKey("User")]
        public int UserId {get; set;}
        public User? User {get; set;}

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount {get; set;}

        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public string TotalStatus {get; set;} // Pending, Shipped, Delivered, Cancelled

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    }
    
}