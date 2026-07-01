using AssetManager.Api.Models.Enums;
namespace AssetManager.Api.Models;

public class Asset3D
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Tags { get; set; }

    public string OriginalFileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string? ThumbnailPath { get; set; }

    public long FileSize { get; set; }

    public int? VertexCount { get; set; }
    public int? TriangleCount { get; set; }
    public int? MeshCount { get; set; }
    public int? MaterialCount { get; set; }
    public int? AnimationCount { get; set; }

    public decimal? Width { get; set; }
    public decimal? Height { get; set; }
    public decimal? Depth { get; set; }

    public AssetStatus Status { get; set; } = AssetStatus.Processing;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<ExportedAssetFile> ExportedFiles { get; set; } = new();
}
