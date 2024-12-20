using System;
using System.Collections.Generic;

namespace Backend_net.Models;

public partial class OrderItem
{
    public int OrderId { get; set; }

    public int ItemId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public virtual Item Item { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}
