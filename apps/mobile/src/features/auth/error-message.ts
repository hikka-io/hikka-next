import { HikkaApiError } from '@hikka/api';

import { FALLBACK_ERROR } from './constants';

export const errorMessage = (error: unknown) =>
    error instanceof HikkaApiError ? error.message : FALLBACK_ERROR;
