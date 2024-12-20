using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_net.Models;
using System.Text;
using System.Security.Cryptography;
using System.CodeDom;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Backend_net.Utility;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Backend_net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;
        private readonly IConfiguration Configuration;
        private readonly ITokenService _tokenService;

        public AccountController(FoodDeliveryContext context, IConfiguration Configuration, ITokenService tokenService)
        {
            _context = context;
            this.Configuration = Configuration;
            _tokenService = tokenService;
        }

        // GET: api/Account
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            try
            {
                Console.WriteLine("Started");
                var account = await _context.Accounts.Include(a => a.Role).Include(a => a.Users).SingleOrDefaultAsync(e => e.Email == model.Email);
                if (account == null)
                {
                    return NotFound("Email Not Found");
                }

                if (account.Password != HashPassword(model.Password))
                {
                    return BadRequest("Incorrect Password");
                }
                var email = account.Email;
                var role = account.Role?.RoleName;
                var user = account.Users?.FirstOrDefault();
                var name = user?.FirstName;
                var id = account.Id;
                Console.WriteLine(id);


                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, id.ToString()),
                    new Claim("firstname", name),
                   new Claim(ClaimTypes.Email, email),

                    new Claim(ClaimTypes.Role, account.Role?.RoleName ?? "User"), // User's role
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

              
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    issuer: Configuration["Jwt:Issuer"],
                    audience: Configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: creds
                );
                var Token = new JwtSecurityTokenHandler().WriteToken(token);
                Console.WriteLine(Token);
                return Ok(new { Message = $"Logged in as {role}", Token = Token });


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Error occured while proccessing the loggin request");
            }

        }
        [HttpGet("user-profile")]
        public async Task<IActionResult> GetUserProfile()
        {

            var email = _tokenService.GetEmail();
            var role = _tokenService.GetRole();
            var firstName = _tokenService.GetFirstName();
            var userId = _tokenService.GetUserId();
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == int.Parse(userId));

            Console.WriteLine("user info " + user);
            if (email == null || role == null || firstName == null || User == null)
            {
                return Unauthorized("Invalid token or missing claims");
            }
            Console.WriteLine("Results :" + email + "" + role + " " + firstName + " " + userId);

            return Ok(new { Email = email, Role = role, FirstName = firstName, UserId = userId,user });

        }

        // GET: api/Account/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserRegistrationDto>> GetUserRegistrationDto(int id)
        {
            var userRegistrationDto = await _context.UserRegistrationDto.FindAsync(id);

            if (userRegistrationDto == null)
            {
                return NotFound();
            }

            return userRegistrationDto;
        }
        [HttpGet("profile/{accountId}")]
        public async Task<IActionResult> GetProfile(int accountId)
        {
            var userProfile = await _context.Users
                .Where(u => u.AccountId == accountId)
                .Select(u => new
                {
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Account != null ? u.Account.Email : null,
                    Role = u.Account != null && u.Account.RoleId != null ?
                           _context.Roles
                               .Where(r => r.Id == u.Account.RoleId)
                               .Select(r => r.RoleName)
                               .FirstOrDefault()
                           : null
                })
                .FirstOrDefaultAsync();

            if (userProfile == null || userProfile.Email == null)
            {
                return NotFound("User profile not found.");
            }

            return Ok(userProfile);
        }

        // PUT: api/Account/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto model)
        {
            try
            {
                var userId = _tokenService.GetUserId();
                var account = await _context.Accounts
                    .Include(a => a.Users)
                    .SingleOrDefaultAsync(a => a.Id == int.Parse(userId));

                if (account == null)
                {
                    return NotFound("User account not found.");
                }

                // Update account fields
                if (!string.IsNullOrEmpty(model.Email))
                {
                    if (_context.Accounts.Any(a => a.Email == model.Email && a.Id != account.Id))
                    {
                        return BadRequest("Email is already taken.");
                    }
                    account.Email = model.Email;
                }

                // Update user fields
                var user = account.Users?.FirstOrDefault();
                if (user != null)
                {
                    if (!string.IsNullOrEmpty(model.FirstName))
                    {
                        user.FirstName = model.FirstName;
                    }

                    if (!string.IsNullOrEmpty(model.LastName))
                    {
                        user.LastName = model.LastName;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok("Profile updated successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while updating the profile.");
            }
        }




        // POST: api/Account
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDto model)
        {
            if (_context.Accounts.Any(e => e.Email == model.Email))
            {
                return BadRequest("Email Already Exists");
            }
            var account = new Account
            {
                Email = model.Email,
                Password = HashPassword(model.Password),
                RoleId = GetRoleIdByName(model.Role)

            };
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var user = new User
            {
                FirstName = model.Firstname,
                LastName = model.Lastname,
                AccountId = account.Id
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Registered Successfully");
        }

        // DELETE: api/Account/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserRegistrationDto(int id)
        {
            var userRegistrationDto = await _context.UserRegistrationDto.FindAsync(id);
            if (userRegistrationDto == null)
            {
                return NotFound();
            }

            _context.UserRegistrationDto.Remove(userRegistrationDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("deleteUser/{accountId}")]
        public async Task<IActionResult> DeleteUserByAccountId(int accountId)
        {
           
            var account = await _context.Accounts
                .Include(a => a.Users)  
                .Include(a => a.Orders) 
                .FirstOrDefaultAsync(a => a.Id == accountId);

            if (account == null)
            {
                return NotFound(new { message = "Account not found" });
            }

            try
            {
               
                foreach (var order in account.Orders)
                {
                    _context.Orders.Remove(order);
                }

                
                foreach (var user in account.Users)
                {
                    _context.Users.Remove(user); 
                }

                
                _context.Accounts.Remove(account);

               
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "User, orders, and account deleted successfully" });
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, new { success = false, message = "Error occurred while deleting user, orders, and account", error = ex.Message });
            }
        }


        private bool UserRegistrationDtoExists(int id)
        {
            return _context.UserRegistrationDto.Any(e => e.Id == id);
        }
        private int GetRoleIdByName(string roleName)
        {
            var role = _context.Roles.FirstOrDefault(r => r.RoleName == roleName);
            return role?.Id ?? 0;
        }
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}
