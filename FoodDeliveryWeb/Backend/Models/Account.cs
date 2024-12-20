﻿using System;
using System.Collections.Generic;

namespace Backend_net.Models;

public partial class Account
{
    public int Id { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public int RoleId { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}