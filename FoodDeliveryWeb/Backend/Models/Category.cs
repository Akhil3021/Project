using System;
using System.Collections.Generic;

namespace Backend_net.Models;

public partial class Category
{
    public int Id { get; set; }

    public int RestaurantId { get; set; }

    public string CategoryName { get; set; } = null!;

    public virtual Restaurant Restaurant { get; set; } = null!;
}
