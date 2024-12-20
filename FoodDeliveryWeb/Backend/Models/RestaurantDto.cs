using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_net.Models
{
    public class RestaurantDto
    {
        [Required]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Tags { get; set; }

        public int MinOrderAmount { get; set; }

        public string Apartment { get; set; }

        public string Street { get; set; }

        public string Locality { get; set; }

        public int ZipCode { get; set; }

        public int Contact { get; set; }

        public string PaymentMode { get; set; }
        public int SellerId { get; set; }


        [NotMapped]
        public IFormFile Image { get; set; }


       
    }
}
