using System.Diagnostics;
using AssetManager.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

Directory.CreateDirectory(
    Path.Combine(app.Environment.ContentRootPath, "storage", "assets")
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.MapGet("/", context =>
    {
        context.Response.Redirect("/swagger/index.html");
        return Task.CompletedTask;
    });

    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var url = "http://localhost:5140/swagger/index.html";

        try
        {
            Process.Start("open", url);
        }
        catch
        {
            Console.WriteLine($"Abra manualmente: {url}");
        }
    });
}

app.UseAuthorization();

app.MapControllers();

app.Run();
