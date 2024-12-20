using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_net.Models;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace Backend_net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public ItemController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // GET: api/Item
        [HttpGet("resItem/{id}")]
        public async Task<ActionResult<Item>> RestarauntItems(int id)
        {
            var items =await _context.Items.Where(x=>x.RestaurantId==id).ToListAsync();
            if (items == null || items.Count==0  )
            {
                return NotFound("No data found");
            }
            Console.WriteLine(items);
            return Ok(items);
        }

        // GET: api/Item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }
        [HttpGet("displayItem")]
        public async Task<ActionResult<ItemDto>> DislayItem()
        {
            var item = await _context.Items.ToListAsync();

            if (item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        // PUT: api/Item/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("updateItem/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateItem(int id, [FromForm] ItemDto model)
        {
            var item = await _context.Items.SingleOrDefaultAsync(x => x.Id == id);
            if (item == null)
            {
                return NotFound("Item Not Found");
            }

           
            item.Name = model.Name;
            item.Category = model.Category;
            item.Price = model.Price;
            item.Description = model.Description;
            item.RestaurantId = model.RestaurantId;

            
            if (model.Image != null)
            {
                
                if (!string.IsNullOrEmpty(item.Image))
                {
                    DeleteImage(item.Image); 
                }

                
                string imageName = new string(Path.GetFileNameWithoutExtension(model.Image.FileName).Take(10).ToArray())
                                   .Replace(' ', '-');
                imageName = imageName + "-" + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(model.Image.FileName);

                
                var imgpath = Path.Combine(@"./uploads", imageName);

                using (Stream stream = new FileStream(imgpath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

              
                item.Image = imageName;
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Item Updated", item });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemDtoExists(id))
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

        // POST: api/Item
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("addItem")]
        public async Task<ActionResult> AddItem([FromForm] ItemDto model)
        {
            if (model == null || model.Image == null)
            {
                return BadRequest("Please provide all required data, including the image.");
            }

            try
            {
                Console.WriteLine("Restaurant Id " + model.RestaurantId);
                string imageName = new string(Path.GetFileNameWithoutExtension(model.Image.FileName).Take(10).ToArray()).Replace(' ','-');
                imageName = imageName+ "-" + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(model.Image.FileName);
          
                var imgpath = Path.Combine(@"./uploads", imageName);

              
                using (Stream stream = new FileStream(imgpath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                var item = new Item
                {
                    Name = model.Name,
                    Description = model.Description,
                    Price = model.Price,
                    Category=model.Category,
                    Image = imageName,
                    RestaurantId = model.RestaurantId
                };
                Console.WriteLine("category" + model.Category);
                _context.Items.Add(item);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Item Added", item });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // DELETE: api/Item/5
        [HttpDelete("removeItem/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
           var item =await _context.Items.SingleOrDefaultAsync(x=>x.Id == id);
            if (item == null)
            {
                return NotFound("Item not found");
            }
            else
            {
                DeleteImage(item.Image);
                _context.Items.Remove(item);

                await _context.SaveChangesAsync();
                return Ok(new { Message = "Item Deleted", item });
            }
            

        }
        [HttpGet("statistics/{restaurantId}")]
        public IActionResult GetItemStatistics(int restaurantId)
        {
            
            var totalItems = _context.Items.Count(i => i.RestaurantId == restaurantId);

           
            var itemOrders = _context.Items
                .Where(i => i.RestaurantId == restaurantId) 
                .Select(i => new
                {
                    ItemName = i.Name,
                    Count = _context.OrderItems
                        .Where(x => x.ItemId == i.Id && x.Order.OrderItems.Any(x => x.Item.RestaurantId == restaurantId)) // Filter by restaurantId of the item
                        .Sum(x => x.Quantity) 
                })
                .ToList();

            return Ok(new
            {
                TotalItems = totalItems,
                ItemOrders = itemOrders
            });
        }




        private bool ItemDtoExists(int id)
        {
            return _context.ItemDto.Any(e => e.Id == id);
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
