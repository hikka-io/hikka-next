import { clearNsfwConsentFn } from '@/utils/cookies/server';

let sessionConsented = false;

export const hasNsfwSessionConsent = () => sessionConsented;

export const grantNsfwSessionConsent = () => {
    sessionConsented = true;
};

export async function clearNsfwConsent() {
    sessionConsented = false;
    await clearNsfwConsentFn();
}
