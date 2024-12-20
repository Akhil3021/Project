using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_net.Models;
using Newtonsoft.Json;

namespace Backend_net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public UsersController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }


        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartRequestDTO request)
        {
            
            var user = await _context.Users.FirstOrDefaultAsync(x=>x.AccountId==request.UserId);
            if (user == null)
            {
                return NotFound(new { Success = false, Message = "User not found" });
            }

            var cartData = string.IsNullOrEmpty(user.CartData)
                ? new Dictionary<string, int>()
                : JsonConvert.DeserializeObject<Dictionary<string, int>>(user.CartData);

            if (cartData.ContainsKey(request.ItemId.ToString())) 
            {
                cartData[request.ItemId.ToString()]++;
            }
            else
            {
                cartData[request.ItemId.ToString()] = 1;
            }

            user.CartData = JsonConvert.SerializeObject(cartData);
            _context.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Item added to cart" });
        }


        [HttpPost("remove")]
        public async Task<IActionResult> RemoveFromCart([FromBody] CartRequestDTO request)
        {
            Console.WriteLine($"Received UserId: {request.UserId}, ItemId: {request.ItemId}");
            var user = await _context.Users.FirstOrDefaultAsync(x => x.AccountId == request.UserId);
            if (!ModelState.IsValid)
            {
                Console.WriteLine("Model validation failed.");
                return BadRequest(ModelState);
            }

            if (user == null)
            {
                return NotFound(new { Success = false, Message = "User not found" });
            }

            var cartData = string.IsNullOrEmpty(user.CartData)
                ? new Dictionary<string, int>()
                : JsonConvert.DeserializeObject<Dictionary<string, int>>(user.CartData);

            if (cartData.ContainsKey(request.ItemId.ToString()))
            {
                cartData[request.ItemId.ToString()]--;
                if (cartData[request.ItemId.ToString()] <= 0)
                {
                    cartData.Remove(request.ItemId.ToString());
                }
            }

            user.CartData = JsonConvert.SerializeObject(cartData);
            _context.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Item removed from cart" });
        }


        [HttpPost("displayCart")]
        public async Task<IActionResult> DisplayCart([FromBody] CartRequestDTO request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.AccountId == request.UserId);
            if (user == null)
            {
                return NotFound(new { Success = false, Message = "User not found" });
            }

            var cartData = string.IsNullOrEmpty(user.CartData)
                ? new Dictionary<string, int>()
                : JsonConvert.DeserializeObject<Dictionary<string, int>>(user.CartData);

            return Ok(cartData );
        }



        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("listUser")]
        public async Task<ActionResult<IEnumerable<UserRoleDto>>> GetAllUsersWithRole()
        {
            var usersWithRole = await _context.Users
                .Include(u => u.Account) 
                .ThenInclude(a => a.Role) 
                .Select(u => new UserRoleDto
                {
                    Firstname = u.FirstName,
                    Lastname = u.LastName,
                    Email = u.Account.Email,
                    RoleName = u.Account.Role.RoleName, 
                    AccountId = u.Account.Id 
                })
                .ToListAsync();

            if (usersWithRole == null || !usersWithRole.Any())
            {
                return NotFound("No users found");
            }

            return Ok(usersWithRole);
        }



        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
