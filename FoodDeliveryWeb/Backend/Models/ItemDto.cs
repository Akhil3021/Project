using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_net.Models
{
    public class ItemDto
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }
        public string? Category { get; set; }

        public int Price { get; set; }
        [NotMapped]
        public IFormFile Image { get; set; }

        public int RestaurantId { get; set; }
    }
}
