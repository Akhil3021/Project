using System.ComponentModel.DataAnnotations;

namespace Backend_net.Models
{
    public class CartRequestDTO
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int ItemId { get; set; }
    }

}
