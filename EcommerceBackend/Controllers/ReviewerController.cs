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
                var reviewer = new Reviewer {
                    Name = request.Name,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    // Address = request.Address
                };
                _context.Reviewers.Add(reviewer);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetReviewer), new { id = reviewer.Id }, reviewer);
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Reviewer>> GetReviewer(int id) {
            var reviewer = await _context.Reviewers.FirstOrDefaultAsync(q => q.Id == id);
            if (reviewer == null)
                return NotFound();
            return reviewer;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reviewer>>> GetAllReviewers() {
            var reviewers = await _context.Reviewers.ToListAsync();
            return reviewers;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReviewer(int id, [FromBody] ReviewerRequest request) {
            var reviewer = await _context.Reviewers.FirstOrDefaultAsync(q => q.Id == id);
            if (reviewer == null)
                return NotFound();
            try {
                reviewer.Name = request.Name;
                reviewer.Email = request.Email;
                reviewer.PhoneNumber = request.PhoneNumber;
                // reviewer.Address = request.Address;
                await _context.SaveChangesAsync();
                return NoContent();
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReviewer(int id) {
            var reviewer = await _context.Reviewers.FirstOrDefaultAsync(q => q.Id == id);
            if (reviewer == null)
                return NotFound();
            try {
                _context.Reviewers.Remove(reviewer);
                await _context.SaveChangesAsync();
                return NoContent();
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

    }
    public class ReviewerRequest {
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        // public string Address { get; set; }
    }
}