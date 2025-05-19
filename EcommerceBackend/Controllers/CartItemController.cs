using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;


namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CartItemController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CartItemController(AppDbContext context)
        {
            _context = context;
        }


        //Tạo mới sản phẩm trong giỏ hàng
        [HttpPost]
        public async Task<ActionResult<CartItem>> CreateCartItem([FromBody] CartItemRequest request)
        {
            try
            {
                var cartItem = new CartItem
                {
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    UserId = request.UserId
                };
                _context.CartItems.Add(cartItem);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCartItem), new { id = cartItem.Id }, cartItem);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<CartItem>> GetCartItem(int id)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(q => q.Id == id);
            if (cartItem == null)
                return NotFound();
            return cartItem;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetAllCartItems()
        {
            var cartItems = await _context.CartItems.ToListAsync();
            return cartItems;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCartItem(int id, [FromBody] CartItemRequest request)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
                return NotFound();

            cartItem.Quantity = request.Quantity;
            _context.Entry(cartItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCartItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
                return NotFound();

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
    }
    public class CartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int UserId { get; set; }
    }
}