import { HikkaApiError } from '@hikka/api';
import { isNetworkError, NETWORK_ERROR_MESSAGE } from '@hikka/core';

import { FALLBACK_ERROR } from './constants';

export const errorMessage = (error: unknown) => {
    if (isNetworkError(error)) return NETWORK_ERROR_MESSAGE;

    return error instanceof HikkaApiError ? error.message : FALLBACK_ERROR;
};
