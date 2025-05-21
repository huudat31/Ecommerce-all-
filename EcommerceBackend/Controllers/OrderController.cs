using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // Tạo đơn hàng mới
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] OrderRequest request)
        {
            try
            {
                var order = new Order
                {
                    UserId = request.UserId,
                    TotalAmount = request.TotalAmount,
                    TotalStatus = request.TotalStatus,
                    
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // Lấy thông tin đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return NotFound();
            return Ok(order);
        }

        // Lấy danh sách tất cả đơn hàng
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            var orders = await _context.Orders.ToListAsync();
            return Ok(orders);
        }

        // Cập nhật đơn hàng
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrder(int id, [FromBody] OrderRequest request)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return NotFound();

            try
            {
                order.TotalAmount = request.TotalAmount;
                order.TotalStatus = request.TotalStatus;

                await _context.SaveChangesAsync();
                return Ok(new { Message = "Cập nhật thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // Xóa đơn hàng
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return NotFound();

            try
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Xóa thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }

    // DTO để nhận dữ liệu khi tạo/cập nhật đơn hàng
    public class OrderRequest
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string TotalStatus { get; set; } = string.Empty;
    }
}
