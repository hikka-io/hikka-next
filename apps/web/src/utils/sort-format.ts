export type SortOrder = 'asc' | 'desc';

/** Single encoding point for the `field:direction` pairs list endpoints take. */
export function formatSort(fields: string[], order: SortOrder): string[] {
    return fields.map((field) => `${field}:${order}`);
}
