using System;
using System.Collections.Generic;

namespace Backend_net.Models;

public partial class Restaurant
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Tags { get; set; }

    public int? MinOrderAmount { get; set; }

    public string? Apartment { get; set; }

    public string? Street { get; set; }

    public string? Locality { get; set; }

    public int? ZipCode { get; set; }

    public int? Contact { get; set; }

    public string? PaymentMode { get; set; }

    public int SellerId { get; set; }

    public string Image { get; set; } = null!;

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    public virtual ICollection<Item> Items { get; set; } = new List<Item>();
}
