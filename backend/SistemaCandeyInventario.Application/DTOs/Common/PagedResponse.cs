namespace SistemaCandeyInventario.Application.DTOs.Common;

public class PagedResponse<T>
{
    public IReadOnlyList<T> Items { get; init; } = Array.Empty<T>();
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalItems { get; init; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalItems / PageSize) : 0;
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}

public class PageQuery
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public string? Search { get; set; }

    public bool IsPaged => Page > 0 || PageSize > 0 || !string.IsNullOrWhiteSpace(Search);
    public int NormalizedPage => Page < 1 ? 1 : Page;
    public int NormalizedPageSize => PageSize is < 1 or > 100 ? 10 : PageSize;
    public int Skip => (NormalizedPage - 1) * NormalizedPageSize;
    public string SearchTerm => Search?.Trim() ?? string.Empty;
}
