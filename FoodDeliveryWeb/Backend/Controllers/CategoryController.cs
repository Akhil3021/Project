using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_net.Models;

namespace Backend_net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public CategoryController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // GET: api/Category
        [HttpGet("category/{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.Where(x => x.RestaurantId == id).ToListAsync();

            if (category == null)
            {
                return NotFound(new { Message = "Category not found." });
            }
            Console.WriteLine(category);
            return Ok(category);
        }


        // GET: api/Category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryDto(int id)
        {
            var categoryDto = await _context.CategoryDto.FindAsync(id);

            if (categoryDto == null)
            {
                return NotFound();
            }

            return categoryDto;
        }

        // PUT: api/Category/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoryDto(int id, CategoryDto categoryDto)
        {
            if (id != categoryDto.Id)
            {
                return BadRequest();
            }

            _context.Entry(categoryDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryDtoExists(id))
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

        // POST: api/Category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("addCategory")]
        public async Task<ActionResult<CategoryDto>> PostCategoryDto([FromBody] CategoryDto model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest("Enter data ");
                }

                var category = new Category
                {
                    CategoryName = model.CategoryName,
                    RestaurantId = model.RestaurantId
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Category Added", category });
            }
            catch (DbUpdateException dbEx)
            {
                
                var innerException = dbEx.InnerException != null ? dbEx.InnerException.Message : dbEx.Message;
                return StatusCode(500, $"Database Update Error: {innerException}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoryDto(int id)
        {
            var categoryDto = await _context.CategoryDto.FindAsync(id);
            if (categoryDto == null)
            {
                return NotFound();
            }

            _context.CategoryDto.Remove(categoryDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryDtoExists(int id)
        {
            return _context.CategoryDto.Any(e => e.Id == id);
        }
    }
}
