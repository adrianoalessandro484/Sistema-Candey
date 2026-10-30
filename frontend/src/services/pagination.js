export function pagedParams({ page = 1, pageSize = 10, search = '' } = {}) {
  return {
    page,
    pageSize,
    search: search?.trim() ? search.trim() : undefined,
  }
}

export function mapPagedResponse(data, mapper) {
  return {
    items: (data?.Items ?? []).map(mapper),
    page: data?.Page ?? 1,
    pageSize: data?.PageSize ?? 10,
    totalItems: data?.TotalItems ?? 0,
    totalPages: data?.TotalPages ?? 0,
    hasPrevious: Boolean(data?.HasPrevious),
    hasNext: Boolean(data?.HasNext),
  }
}
