
using AssetManager.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManager.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Asset3D> Assets => Set<Asset3D>();
    public DbSet<ExportedAssetFile> ExportedFiles => Set<ExportedAssetFile>();
}
