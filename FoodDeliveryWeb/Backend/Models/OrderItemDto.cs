﻿namespace Backend_net.Models
{
    public class OrderItemDto
    {
        public int ItemId { get; set; }
        public string? ItemName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
