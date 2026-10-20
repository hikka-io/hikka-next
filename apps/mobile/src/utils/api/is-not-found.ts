import { HikkaApiError } from '@hikka/api';

/** A 404: the page's entity does not exist. Only detail pages read it as "not found"; lists keep a retry. */
export const isNotFoundError = (error: unknown) =>
    error instanceof HikkaApiError && error.status === 404;
