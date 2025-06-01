
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("api/categories")]

    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        //Tạo mới danh mục
        [HttpPost]
        public async Task<ActionResult<Category>>
                CreateCategory([FromBody] CategoryRequest request)
        {
            try
            {
                var category = new Category
                {
                    Name = request.Name,
                    Description = request.Description
                };
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCategory),
                            new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Lấy danh mục
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(q => q.Id == id);
            if (category == null)
                return NotFound();
            return category;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return categories;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategory(int id, [FromBody] CategoryRequest request)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(q => q.Id == id);
            if (category == null)
                return NotFound();
            category.Name = request.Name;
            category.Description = request.Description;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Cap nhat thanh cong"
            });



        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(q => q.Id == id);
            if (category == null)
                return NotFound();
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Xoa thanh cong"
            });
        }



    }

    public class CategoryRequest
    {
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}