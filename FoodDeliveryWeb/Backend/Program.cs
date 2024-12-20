using Backend_net.Models;
using Backend_net.Utility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Get configuration from builder
var configuration = builder.Configuration; // Access the configuration

// Add services to the container.
var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]); // Get the JWT secret key from configuration
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // Default scheme for authentication
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // Challenge scheme for authorization
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, // Validate the token's issuer
        ValidateAudience = true, // Validate the token's audience
        ValidateLifetime = true, // Validate the token's expiration
        ValidateIssuerSigningKey = true, // Validate the signing key
        ValidIssuer = configuration["Jwt:Issuer"], // Get issuer from configuration
        ValidAudience = configuration["Jwt:Audience"], // Get audience from configuration
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173", "http://localhost:3000") // React app URL
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Configure Entity Framework with SQL Server
builder.Services.AddDbContext<FoodDeliveryContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Food_Delivery")));

builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("Stripe"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = null;
    options.JsonSerializerOptions.MaxDepth = 64; // Increase MaxDepth if necessary
});
var app = builder.Build();
app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath,"uploads")),
    RequestPath = "/uploads"
}) ;
app.UseHttpsRedirection();
app.UseAuthentication(); // Ensure this is before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();
