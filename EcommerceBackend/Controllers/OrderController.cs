using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers {
    [ApiController]
    [Route("[controller]")]
    public class ReviewerController : ControllerBase {
        private readonly AppDbContext _context;
        public ReviewerController(AppDbContext context) {
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<Reviewer>> CreateReviewer([FromBody] ReviewerRequest request) {
            try {
                var order = new Order {
                    ReviewerId = request.ReviewerId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    TotalPrice = request.TotalPrice,
                   
                };
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id) {
            var order = await _context.Orders.FirstOrDefaultAsync(q => q.Id == id);
            if (order == null)
                return NotFound();
            return order;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders() {
            var orders = await _context.Orders.ToListAsync();
            return orders;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrder(int id, [FromBody] OrderRequest request) {
            var order = await _context.Orders.FirstOrDefaultAsync(q => q.Id == id);
            if (order == null)
                return NotFound();
            try {
                order.ReviewerId = request.ReviewerId;
                order.ProductId = request.ProductId;
                order.Quantity = request.Quantity;
                order.TotalPrice = request.TotalPrice;
                await _context.SaveChangesAsync();
                return Ok(
                    new {
                        Message = "Cập nhật thành công",
                    }
                );
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id) {
            var order = await _context.Orders.FirstOrDefaultAsync(q => q.Id == id);
            if (order == null)
                return NotFound();
            try {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return Ok(
                    new {
                        Message = "Xóa thành công",
                    }
                );
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
    }
    public class OrderRequest {
        public int ReviewerId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}