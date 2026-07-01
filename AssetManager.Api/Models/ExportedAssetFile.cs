using AssetManager.Api.Models.Enums;
using AssetManager.Api.Models;

public class ExportedAssetFile
{
    public Guid Id { get; set; }

    public Guid Asset3DId { get; set; }
    public Asset3D Asset3D { get; set; } = null!;

    public string Format { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public ExportStatus Status { get; set; } = ExportStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
