import { toast } from 'sonner-native';

import { HikkaApiError } from '@hikka/api';
import { apiErrorMessage, isNetworkError } from '@hikka/core';

export const OFFLINE_TOAST_ID = 'offline';

// Backend answer for an account whose email is not confirmed yet; the resend button is on the own profile.
const CONFIRM_EMAIL_ERROR = 'permission:confirm_email';
const CONFIRM_EMAIL_HINT =
    'Лист із підтвердженням можна надіслати повторно у профілі.';

let offlineToastShown = false;
let openProfile: (() => void) | null = null;

export function setOfflineToastShown(shown: boolean) {
    offlineToastShown = shown;
}

/** Set by `components/navigation-bridge`: null while a root sheet covers the tabs. */
export function setProfileOpener(opener: (() => void) | null) {
    openProfile = opener;
}

// While the persistent offline toast is up, a failed write would repeat it.
export function toastApiError(error: unknown, fallback: string) {
    if (offlineToastShown && isNetworkError(error)) return;

    if (error instanceof HikkaApiError && error.code === CONFIRM_EMAIL_ERROR) {
        const id = toast.error(apiErrorMessage(error, fallback), {
            description: CONFIRM_EMAIL_HINT,
            action: openProfile
                ? {
                      label: 'До профілю',
                      onClick: () => {
                          toast.dismiss(id);
                          openProfile?.();
                      },
                  }
                : undefined,
        });
        return;
    }

    toast.error(apiErrorMessage(error, fallback));
}
