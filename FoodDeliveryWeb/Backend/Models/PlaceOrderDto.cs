namespace Backend_net.Models
{
    public class PlaceOrderDto
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public AddressDto Address { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}
