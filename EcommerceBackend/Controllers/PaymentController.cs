using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;


namespace Controllers{
    [ApiController]
    [Route("[controller]")]
    public class PaymentController: ControllerBase{
        private readonly AppDbContext _context;
        public PaymentController(AppDbContext context){
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePayment([FromBody] PaymentRequest request){
            try{
                var payment = new Payment{
                    OrderId = request.OrderId,
                    PaymentAmount = request.PaymentAmount,
                    PaymentMethod = request.PaymentMethod,
                    PaymentStatus = request.PaymentStatus,
                    TransactionId = request.TransactionId
                };
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id){
            var payment = await _context.Payments.FirstOrDefaultAsync(q => q.Id == id);
            if(payment == null)
                return NotFound();
            return payment;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAllPayments(){
            var payments = await _context.Payments.ToListAsync();
            return payments;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePayment(int id, [FromBody] PaymentRequest request){
            var payment = await _context.Payments.FirstOrDefaultAsync(q => q.Id == id);
            if(payment == null)
                return NotFound();
            try{
                payment.OrderId = request.OrderId;
                payment.PaymentAmount = request.PaymentAmount;
                payment.PaymentMethod = request.PaymentMethod;
                payment.PaymentStatus = request.PaymentStatus;
                payment.TransactionId = request.TransactionId;
                await _context.SaveChangesAsync();
                return NoContent();
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePayment(int id){
            var payment = await _context.Payments.FirstOrDefaultAsync(q => q.Id == id);
            if(payment == null)
                return NotFound();
            try{
                _context.Payments.Remove(payment);
                await _context.SaveChangesAsync();
                return NoContent();
            }catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
    }
    public class PaymentRequest{
        public int OrderId {get; set;}
        public decimal PaymentAmount {get; set;}
        public string PaymentMethod {get; set;}
        public string PaymentStatus {get; set;}
        public string TransactionId {get; set;}
    }
}