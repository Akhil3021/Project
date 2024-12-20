using Backend_net.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend_net.Utility
{
    public interface ITokenService
    {
        string GetEmail();
        string GetRole();
        string GetFirstName();
        string GetUserId();
    }

    public class TokenService : ITokenService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TokenService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public string GetUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                Console.WriteLine("User ID claim not found in the token.");
                return null;
            }

            var userId = userIdClaim.Value;
            Console.WriteLine($"User ID from the token is {userId}");
            return userId;
        }

        public string GetEmail()
        {
            var email = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
            Console.WriteLine($"Email from the token is {email}");
            return email;
        }

        public string GetRole()
        {
           var role =  _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value;
            Console.WriteLine($"Role from the token is {role}");
            return role;

        }

        public string GetFirstName()
        {
            var name= _httpContextAccessor.HttpContext?.User.FindFirst("firstname")?.Value;
            Console.WriteLine($"Name from the token is {name}");

            return name;
        
        }
    }
}
