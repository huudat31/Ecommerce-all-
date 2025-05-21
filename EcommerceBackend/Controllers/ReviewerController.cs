using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var reviewer = new Reviewer {
                
            };

            _context.Reviewers.Add(reviewer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReviewer), new { id = reviewer.Id }, reviewer);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Reviewer>> GetReviewer(int id) {
            var reviewer = await _context.Reviewers.FindAsync(id);
            if (reviewer == null)
                return NotFound();
            return reviewer;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reviewer>>> GetAllReviewers() {
            return await _context.Reviewers.ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReviewer(int id, [FromBody] ReviewerRequest request) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var reviewer = await _context.Reviewers.FindAsync(id);
            if (reviewer == null)
                return NotFound();

            

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReviewer(int id) {
            var reviewer = await _context.Reviewers.FindAsync(id);
            if (reviewer == null)
                return NotFound();

            _context.Reviewers.Remove(reviewer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // NÊN tách class này vào thư mục DTOs riêng
    public class ReviewerRequest {
        
    }
}
