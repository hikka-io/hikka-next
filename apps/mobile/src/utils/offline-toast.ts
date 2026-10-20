import { router } from 'expo-router';
import { toast } from 'sonner-native';

import { HikkaApiError } from '@hikka/api';
import { apiErrorMessage, isNetworkError } from '@hikka/core';

export const OFFLINE_TOAST_ID = 'offline';

// Backend answer for an account whose email is not confirmed yet; the resend button is on the own profile.
const CONFIRM_EMAIL_ERROR = 'permission:confirm_email';

let offlineToastShown = false;

export function setOfflineToastShown(shown: boolean) {
    offlineToastShown = shown;
}

// While the persistent offline toast is up, a failed write would repeat it.
export function toastApiError(error: unknown, fallback: string) {
    if (offlineToastShown && isNetworkError(error)) return;

    if (error instanceof HikkaApiError && error.code === CONFIRM_EMAIL_ERROR) {
        const id = toast.error(apiErrorMessage(error, fallback), {
            description:
                'Лист із підтвердженням можна надіслати повторно у профілі.',
            action: {
                label: 'До профілю',
                onClick: () => {
                    toast.dismiss(id);
                    if (router.canDismiss()) router.dismissAll();
                    router.navigate('/(tabs)/(profile)');
                },
            },
        });
        return;
    }

    toast.error(apiErrorMessage(error, fallback));
}
