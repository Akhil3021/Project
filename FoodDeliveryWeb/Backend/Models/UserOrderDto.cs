namespace Backend_net.Models
{
    public class UserOrderDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }  // Add other relevant user details
        public List<OrderDto> Orders { get; set; } = new List<OrderDto>();
    }
}
