namespace Backend_net.Models
{
    public class CategoryDto
    {
        public int Id { get; set; }

        public int RestaurantId { get; set; }

        public string CategoryName { get; set; } = null!;
    }
}
