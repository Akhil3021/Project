using System;
using System.Collections.Generic;

namespace Backend_net.Models;

public partial class Item
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? Category { get; set; }

    public int Price { get; set; }

    public string? Image { get; set; }

    public int RestaurantId { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Restaurant Restaurant { get; set; } = null!;
}

