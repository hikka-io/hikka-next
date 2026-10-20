import { toast } from 'sonner-native';

import { apiErrorMessage, isNetworkError } from '@hikka/core';

export const OFFLINE_TOAST_ID = 'offline';

let offlineToastShown = false;

export function setOfflineToastShown(shown: boolean) {
    offlineToastShown = shown;
}

// While the persistent offline toast is up, a failed write would repeat it.
export function toastApiError(error: unknown, fallback: string) {
    if (offlineToastShown && isNetworkError(error)) return;

    toast.error(apiErrorMessage(error, fallback));
}
