using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/Products")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProductController(AppDbContext context)
        {
            _context = context;
        }


        //Tạo mới sản phẩm
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] ProductRequest request)
        {
            try
            {
                var product = new Product
                {
                    Name = request.Name,
                    Description = request.Description,
                    Price = request.Price,
                    CategoryId = request.CategoryId,
                    Instock = request.Instock,
                    ImageUrl = request.ImageUrl
                };
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Lấy sản phẩm
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponse>> GetProduct(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(q => q.Id == id);
            if (product == null)
                return NotFound();
            return new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId,
                Stock = product.Instock,
                Instock = product.Instock > 0 ? true : false,
                ImageUrl = product.ImageUrl,
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponse>>> GetAllProducts()
        {
            var products = await _context.Products.Select(product => new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId,
                Stock = product.Instock,
                Instock = product.Instock > 0 ? true : false,
                ImageUrl = product.ImageUrl
            }).ToListAsync();
            return products;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] ProductRequest request)
        {
            var product = await _context.Products.FirstOrDefaultAsync(q => q.Id == id);
            if (product == null)
                return NotFound();
            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.CategoryId = request.CategoryId;
            product.Instock = request.Instock;
            product.ImageUrl = request.ImageUrl;
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Cập nhật thành công" });
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(q => q.Id == id);
            if (product == null)
                return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Xóa thành công" });
        }
    }
    public class ProductRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }

        public int Instock { get; set; }

        public string? ImageUrl { get; set; }
    }

    public class ProductResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public int Stock { get; set; }
        public bool Instock { get; set; }
        public string? ImageUrl { get; set; }
    }
}