using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_net.Models;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend_net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public RestaurantController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // GET: api/RestaurantDtoes
        [HttpGet("restaurants")]
        public async Task<ActionResult<List<Restaurant>>> DisplayRestaruant()
        {
            var restaurant = await _context.Restaurants.ToListAsync();
            return Ok(new { success = true, restaurant });
        }


        // GET: api/RestaurantDtoes/5
        [HttpGet("restaurantIfno/{id}")]
        public async Task<ActionResult<Restaurant>> GetSellerRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.SingleOrDefaultAsync(x=>x.SellerId == id);

            if (restaurant == null)
            {
                return NotFound();
            }
            Console.WriteLine(restaurant);
           return Ok(restaurant);
        }
        [HttpGet("restaurant/{id}")]
        public async Task<ActionResult<Restaurant>> GetRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.SingleOrDefaultAsync(x => x.Id == id);

            if (restaurant == null)
            {
                return NotFound();
            }
            Console.WriteLine(restaurant);
            return Ok(restaurant);
        }

        // PUT: api/RestaurantDtoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("updateRestaurant/{id}")]
        public async Task<IActionResult> PutRestaurantDto(int id, RestaurantDto model)
        {
         
            var restaurant = await _context.Restaurants.SingleOrDefaultAsync(x=>x.Id == id);

            if(restaurant is null)
            {
                return NotFound("Restaurant Not Found");
            }
            restaurant.Name=model.Name;
            restaurant.Tags = model.Tags;
            restaurant.MinOrderAmount = model.MinOrderAmount;
            restaurant.Apartment = model.Apartment;
            restaurant.Street = model.Street;
            restaurant.Locality = model.Locality;
            restaurant.ZipCode = model.ZipCode;
            restaurant.Contact = model.Contact;
            restaurant.PaymentMode = model.PaymentMode;
            restaurant.SellerId = model.SellerId;

            if (model.Image != null)
            {
                DeleteImage(restaurant.Image);

                string imageName = new string(Path.GetFileNameWithoutExtension(model.Image.FileName).Take(10).ToArray()).Replace(' ', '-');
                imageName = imageName + "-" + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(model.Image.FileName);

                var imgpath = Path.Combine(@"./uploads", imageName);

                
                using (Stream stream = new FileStream(imgpath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }
                restaurant.Image = imageName;
            }

        

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Restaurant Updated", restaurant });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RestaurantDtoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/RestaurantDtoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("addRestaurant")]
        public async Task<ActionResult> PostRestaurantDto([FromForm] RestaurantDto model)
        {
            if (model.SellerId == 0) 
            {
                return BadRequest("Invalid seller_id.");
            }


            if (model==null || model.Image == null)
            {
                return BadRequest("Enter Proper data and image");
            }
            Console.WriteLine("restaurant-model-Id" + model.SellerId );

            string imageName = new string(Path.GetFileNameWithoutExtension(model.Image.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + "-" + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(model.Image.FileName);

            var imgpath = Path.Combine(@"./uploads", imageName);

            using (Stream stream = new FileStream(imgpath, FileMode.Create))
            {
                await model.Image.CopyToAsync(stream);
            }
            var restaurant = new Restaurant
            {
                Name = model.Name,
                Tags = model.Tags,
                MinOrderAmount = model.MinOrderAmount,
                Apartment = model.Apartment,
                Street = model.Street,
                Locality = model.Locality,
                ZipCode = model.ZipCode,
                Contact = model.Contact,
                PaymentMode = model.PaymentMode,
                Image = imageName,
                SellerId = model.SellerId
            };
            Console.WriteLine("restaurant" + restaurant);
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return Ok(new {Message="Restaurant Added",restaurant});
        }

        // DELETE: api/RestaurantDtoes/5
        [HttpDelete("deleteRestaurant/{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Categories)
                .Include(r => r.Items)
                .SingleOrDefaultAsync(r => r.Id == id);

            if (restaurant == null)
            {
                return NotFound();
            }

           
            _context.Categories.RemoveRange(restaurant.Categories);

           
            _context.Items.RemoveRange(restaurant.Items);

           
            _context.Restaurants.Remove(restaurant);

            await _context.SaveChangesAsync();

            return Ok("Restaurant deleted"); 
        }




        private bool RestaurantDtoExists(int id)
        {
            return _context.RestaurantDto.Any(e => e.Id == id);
        }
        [NonAction]
        public void DeleteImage(string imageName)
        {

            var rootPath = Directory.GetCurrentDirectory(); 
            var imagePath = Path.Combine(rootPath, "uploads", imageName); 

            Console.WriteLine($"Image Path: {imagePath}");
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath); 
            }
            else
            {
                Console.WriteLine("Image not found.");
            }
        }
    }
}
