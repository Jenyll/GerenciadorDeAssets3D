using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

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
