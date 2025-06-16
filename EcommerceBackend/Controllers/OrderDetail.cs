using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/OrderDetails")]
    public class OrderDetailController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OrderDetailController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<OrderDetail>> CreateOrderDetail([FromBody] OrderDetailRequest request)
        {
            try
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = request.OrderId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    Price = request.Price,
                };
                _context.OrderDetails.Add(orderDetail);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.Id }, orderDetail);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetail>> GetOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FirstOrDefaultAsync(q => q.Id == id);
            if (orderDetail == null)
                return NotFound();
            return orderDetail;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetAllOrderDetails()
        {
            var orderDetails = await _context.OrderDetails.ToListAsync();
            return orderDetails;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrderDetail(int id, [FromBody] OrderDetailRequest request)
        {
            var orderDetail = await _context.OrderDetails.FirstOrDefaultAsync(q => q.Id == id);
            if (orderDetail == null)
                return NotFound();
            try
            {
                orderDetail.OrderId = request.OrderId;
                orderDetail.ProductId = request.ProductId;
                orderDetail.Quantity = request.Quantity;
                orderDetail.Price = request.Price;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FirstOrDefaultAsync(q => q.Id == id);
            if (orderDetail == null)
                return NotFound();
            try
            {
                _context.OrderDetails.Remove(orderDetail);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
    public class OrderDetailRequest
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}