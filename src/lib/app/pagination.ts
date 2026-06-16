export function parsePage(value: string | undefined) {
  const page = Number(value);
  if (Number.isFinite(page) && page > 0) {
    return Math.floor(page);
  }
  return 1;
}

export function parseLimit(value: string | undefined) {
  const limit = Number(value);
  if (!Number.isFinite(limit)) {
    return 10;
  }
  return Math.min(100, Math.max(5, Math.floor(limit)));
}

export interface ListSearchParams {
  limit?: string;
  page?: string;
  q?: string;
  sort?: string;
}

export function parseListParams(params: ListSearchParams) {
  return {
    page: parsePage(params.page),
    limit: parseLimit(params.limit),
    query: params.q?.trim() ?? "",
    sort: params.sort ?? "name",
  };
}
