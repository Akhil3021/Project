namespace Backend_net.Models
{
    public class OrderDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Address { get; set; }
        public string? Status { get; set; }
        public DateTime? Date { get; set; }
        public bool? Payment { get; set; }
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }
}
