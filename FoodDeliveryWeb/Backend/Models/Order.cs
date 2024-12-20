using System;
using System.Collections.Generic;

namespace Backend_net.Models;

public partial class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public string Address { get; set; } = null!;

    public string? Status { get; set; }

    public DateTime? Date { get; set; }

    public bool? Payment { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Account User { get; set; } = null!;
}
