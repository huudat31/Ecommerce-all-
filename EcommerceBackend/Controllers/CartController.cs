using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Models;


namespace Controllers
{
    [ApiController]
    [Route("api/Cards")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CartController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<CartController>> CreateCart([FromBody] CartRequest request)
        {
            try
            {
                var cart = new Cart
                {
                    UserId = request.UserId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCart), new { id = cart.CartItemId }, cart);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            var cart = await _context.Carts.FirstOrDefaultAsync(q => q.CartItemId == id);
            if (cart == null)
                return NotFound();
            return cart;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetAllCarts()
        {
            var carts = await _context.Carts.ToListAsync();
            return carts;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCart(int id, [FromBody] CartRequest request)
        {
            var cart = await _context.Carts.FirstOrDefaultAsync(q => q.CartItemId == id);
            if (cart == null)
                return NotFound();
            try
            {
                cart.UserId = request.UserId;
                cart.ProductId = request.ProductId;
                cart.Quantity = request.Quantity;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            var cart = await _context.Carts.FirstOrDefaultAsync(q => q.CartItemId == id);
            if (cart == null)
                return NotFound();
            try
            {
                _context.Carts.Remove(cart);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
    public class CartRequest
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}