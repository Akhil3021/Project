using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_net.Models;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using Newtonsoft.Json;

namespace Backend_net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;
        private readonly StripeSettings _stripeSettings;

        public OrdersController(FoodDeliveryContext context, IOptions<StripeSettings> stripeSettings)
        {
            _context = context;
            _stripeSettings = stripeSettings.Value;
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("placeOrder")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto orderDto)
        {
            try
            {
                
                if (orderDto == null ||
                    string.IsNullOrEmpty(orderDto.Address?.Email) ||
                    orderDto.Items == null ||
                    !orderDto.Items.Any())
                {
                    return BadRequest(new { success = false, message = "Invalid order data." });
                }

                
                var items = await _context.Items
                    .Where(i => orderDto.Items.Select(x => x.ItemId).Contains(i.Id))
                    .ToListAsync();

                // Prepare order items
                var orderItems = orderDto.Items.Select(itemDto => new OrderItem
                {
                    ItemId = itemDto.ItemId,  
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price
                }).ToList();

                // Create the order
                var order = new Order
                {
                    UserId = orderDto.UserId,
                    Amount = orderDto.Amount,
                    Address = $"{orderDto.Address?.Street}, {orderDto.Address?.City}, {orderDto.Address?.Zip}",
                    Date = DateTime.Now,
                    Payment = false,  
                    OrderItems = orderItems
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

            
                var frontendUrl = "http://localhost:5173"; 
                var successUrl = $"{frontendUrl}/verify?success=true&orderId={order.Id}";
                var cancelUrl = $"{frontendUrl}/verify?success=false&orderId={order.Id}";

               
                var sessionOptions = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = orderDto.Items.Select(item => new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(item.Price * 100),  
                            Currency = "inr",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"Item {item.ItemId}"  
                            }
                        },
                        Quantity = item.Quantity
                    }).ToList(),
                    Mode = "payment",
                    SuccessUrl = successUrl,
                    CancelUrl = cancelUrl,
                };

                var service = new SessionService();
                var session = await service.CreateAsync(sessionOptions);
                Console.WriteLine($"Generated Stripe Session URL: {session.Url}");

                
                return Ok(new
                {
                    success = true,
                    sessionUrl = session.Url,
                    orderId = order.Id
                });
            }
            catch (Exception ex)
            {
                
                return BadRequest(new { success = false, message = $"Error: {ex.Message}" });
            }
        }


        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOrder([FromBody] VerifyOrderDto model)
        {
            try
            {
                var order = await _context.Orders.FindAsync(model.OrderId);
                if (order == null)
                    return NotFound(new { success = false, message = "Order not found" });

                order.Payment = model.Success == "true";
                await _context.SaveChangesAsync();

                return Ok(new { success = model.Success == "true", message = model.Success == "true" ? "Paid" : "Not paid" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error: " + ex.Message });
            }
        }
        [HttpPost("userOrder")]
        public async Task<ActionResult<UserOrderDto>> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Where(x => x.UserId == userId)  
                .Include(x => x.User)  
                .Include(x => x.OrderItems)  
                .ThenInclude(x => x.Item)  
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound();  
            }

           
            var userOrderDto = new UserOrderDto
            {
                UserId = userId,
                UserName = orders.First().User.Email,  
                Orders = orders.Select(x => new OrderDto
                {
                    Id = x.Id,
                    Amount = x.Amount,
                    Address = x.Address,
                    Status = x.Status,
                    Date = x.Date,
                    Payment = x.Payment,
                    Items = x.OrderItems.Select(x => new OrderItemDto
                    {
                        ItemId = x.ItemId,
                        ItemName = x.Item.Name,  
                        Quantity = x.Quantity,
                        Price = x.Price
                    }).ToList()
                }).ToList()
            };

            return Ok(userOrderDto);
        }





        // Display all orders (for admin)
        [HttpGet("DisplayOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
               
                var orders = await _context.Orders
                    .Include(i => i.User)  
                    .Include(i => i.OrderItems)  
                    .ThenInclude(i => i.Item)  
                    .ToListAsync();

                if (orders == null || !orders.Any())
                {
                    return NotFound();  
                }

               
                var groupedOrders = orders
                    .GroupBy(i => i.UserId)  
                    .Select(group => new UserOrderDto
                    {
                        UserId = group.Key,  
                        UserName = group.First().User.Email,  
                        Orders = group.Select(i => new OrderDto
                        {
                            Id = i.Id,
                            Amount = i.Amount,
                            Address = i.Address,
                            Status = i.Status,
                            Date = i.Date,
                            Payment = i.Payment,
                            Items = i.OrderItems.Select(x => new OrderItemDto
                            {
                                ItemId = x.ItemId,
                                ItemName = x.Item != null ? x.Item.Name : "Unknown Item",  // Ensure Item is not null
                                Quantity = x.Quantity,
                                Price = x.Price
                            }).ToList()
                        }).ToList()
                    })
                    .ToList();

                return Ok(groupedOrders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error: " + ex.Message });
            }
        }




        [HttpPost("status")]
        public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateStatusDto dto)
        {
            try
            {
                var order = await _context.Orders.FindAsync(dto.OrderId);
                if (order == null)
                    return NotFound(new { success = false, message = "Order not found" });

                order.Status = dto.Status;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Status updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error: " + ex.Message });
            }
        }
        [HttpGet("RestaurantOrders")]
        public async Task<IActionResult> GetOrdersByRestaurant(int restaurantId)
        {
            try
            {
                
                var orders = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(x => x.Item) 
                    .Where(o => o.OrderItems.Any(x => x.Item.RestaurantId == restaurantId)) // Filter by restaurant
                    .Select(o => new
                    {
                        o.Id,
                        o.Amount,
                        o.Date,
                        o.Payment,
                        o.Address,
                        o.Status,
                        Items = o.OrderItems
                            .Where(x => x.Item.RestaurantId == restaurantId)
                            .Select(x => new
                            {
                                x.ItemId,
                                x.Item.Name,
                                x.Quantity,
                                x.Price
                            }).ToList()
                    })
                    .ToListAsync();

                if (!orders.Any())
                {
                    return NotFound(new { success = false, message = "No orders found for the specified restaurant." });
                }

                return Ok(new { success = true, data = orders });
            }
            catch (Exception ex)
            {
               
                return BadRequest(new { success = false, message = "Error: " + ex.Message });
            }
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("summary/{restaurantId}")]
        public IActionResult GetOrderSummary(int restaurantId)
        {
            
            var pendingOrders = _context.Orders
                .Where(o => o.OrderItems.Any(x => x.Item.RestaurantId == restaurantId) && o.Status == "Food Processing")
                .Count();

            var deliveredOrders = _context.Orders
                .Where(o => o.OrderItems.Any(x => x.Item.RestaurantId == restaurantId) && o.Status == "Delivered")
                .Count();

            var outForDeliveryOrders = _context.Orders
                .Where(o => o.OrderItems.Any(x => x.Item.RestaurantId == restaurantId) && o.Status == "Out For Delivery")
                .Count();

            var canceledOrders = _context.Orders
                .Where(o => o.OrderItems.Any(x => x.Item.RestaurantId == restaurantId) && o.Status == "Canceled")
                .Count();

            return Ok(new
            {
                PendingOrders = pendingOrders,
                DeliveredOrders = deliveredOrders,
                OutForDeliveryOrders = outForDeliveryOrders,
                CanceledOrders = canceledOrders
            });
        }


        [HttpGet("chart/{restaurantId}")]
        public IActionResult GetIncomeChartData(int restaurantId)
        {
            
           

            
            var incomeData = _context.OrderItems
                .Where(x => _context.Items.Any(i => i.Id == x.ItemId && i.RestaurantId == restaurantId))  
                .Where(x => x.Order.Date.HasValue) 
                .GroupBy(x => x.Order.Date.Value.Date)  
                .Select(g => new
                {
                    Date = g.Key.ToShortDateString(),  
                    Income = g.Sum(x => x.Quantity * x.Price)  
                })
                .ToList();
            Console.WriteLine("Income Data: " + (incomeData));
            
            Console.WriteLine("Income Data: " + JsonConvert.SerializeObject(incomeData));

           
            if (incomeData.Count == 0)
            {
                return NotFound("No income data found.");
            }

            
            return Ok(incomeData);
        }





       
        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
