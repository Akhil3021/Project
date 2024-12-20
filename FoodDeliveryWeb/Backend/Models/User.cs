using System;
using System.Collections.Generic;

namespace Backend_net.Models;

public partial class User
{
    public int Id { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public int AccountId { get; set; }

    public string? CartData { get; set; }

    public virtual Account Account { get; set; } = null!;
}
