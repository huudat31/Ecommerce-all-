using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;



namespace Controllers{
    [ApiController]
    [Route("[controller]")]
    public class ReviewerController: ControllerBase{
        private readonly AppDbContext _context;
        public ReviewerController(AppDbContext context){
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<Reviewer>> CreateReviewer([FromBody] ReviewerRequest request){
            try{
                var reviewer = new Reviewer{
                    UserId = request.UserId,
                    ProductId = request.ProductId,
                    Rating = request.Rating,
                    Comment = request.Comment,
                };
                _context.Reviewers.Add(reviewer);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetReviewer), new {id = reviewer.Id}, reviewer);
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }


        // Lay danh sach theo id sa
        [HttpGet("{id}")]
        public async Task<ActionResult<Reviewer>> GetReviewer(int id){
            var reviewer = await _context.Reviewers.FirstOrDefaultAsync(q=> q.Id == id);
            if(reviewer == null)
                return NotFound();
            return reviewer;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reviewer>>> GetAllReviewers(){
            var reviewers = await _context.Reviewers.ToListAsync();
            return reviewers;

        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReviewer(int id, [FromBody] ReviewerRequest request){
            var reviewer = await _context.Reviewers.FirstOrDefaultAsync(q=> q.Id == id);
            if(reviewer == null)
                return NotFound();
            try{
                reviewer.UserId = request.UserId;
                reviewer.ProductId = request.ProductId;
                reviewer.Rating = request.Rating;
                reviewer.Comment = request.Comment;
                await _context.SaveChangesAsync();
                return Ok(new{
                    Message = "Update successful"
                });
            }
            catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReviewer(int id){
            var reviewer = await _context.Reviewers.FirstOrDefaultAsync(q=>q.Id ==  id);
            if(reviewer == null)
                return NotFound();
            try{
                _context.Reviewers.Remove(reviewer);
                await _context.SaveChangesAsync();
                return Ok(new{
                    Message = "Delete successful"
                });
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
    }
    public class ReviewerRequest{
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}