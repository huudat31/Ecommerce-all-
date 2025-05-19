using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;


namespace Controllers {
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase {
        private readonly AppDbContext _context;
        public OrderController(AppDbContext context){
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] OrderRequest request){
            try{
                var order = new Order{
                    UserId = request.UserId,
                    TotalAmount = request.TotalAmount,
                    TotalStatus = request.TotalStatus,
                    CreatedAt = DateTime.UtcNow,
                };
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetOrder), new {id = order.Id}, order);
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id){
            var order = await _context.Orders.FirstOrDefaultAsync(q=> q.Id == id);
            if(order == null)
                return NotFound();
            return order;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders(){
            var orders = await _context.Orders.ToListAsync();
            return orders;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrder(int id, [FromBody] OrderRequest request){
            var order = await _context.Orders.FirstOrDefaultAsync(q=> q.Id == id);
            if(order == null)
                return NotFound();
            try{
                order.UserId = request.UserId;
                order.TotalAmount = request.TotalAmount;
                order.TotalStatus = request.TotalStatus;
                await _context.SaveChangesAsync();
                return Ok(new{
                    Message = "Update successful"
                });
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id){
            var order = await _context.Orders.FirstOrDefaultAsync(q=> q.Id == id);
            if(order == null)
                return NotFound();
            try{
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return Ok(new{
                    Message = "Delete successful"
                });
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }

    }
    public class OrderRequest{
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string TotalStatus { get; set; } = string.Empty;
    }
}