import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

// A guest's remembered consent, until the MMKV prefs store exists; the value is its expiry in ms.
const CONSENT_KEY = 'nsfw-consent';
// The web's consent cookie lasts 7 days ("Вибір буде збережено на 7 днів").
const REMEMBER_MS = 7 * 24 * 60 * 60 * 1000;

const readStoredConsent = () => {
    try {
        const until = Number(SecureStore.getItem(CONSENT_KEY));
        return Number.isFinite(until) && until > Date.now();
    } catch {
        return false;
    }
};

type State = { consented: boolean };

const useNsfwConsentStore = create<State>(() => ({
    consented: readStoredConsent(),
}));

/** The 18+ consent given on this device: for this launch, or remembered by a guest for 7 days. */
export const useNsfwConsent = () =>
    useNsfwConsentStore((state) => state.consented);

export function grantNsfwConsent({ remember }: { remember: boolean }) {
    useNsfwConsentStore.setState({ consented: true });
    if (!remember) return;
    SecureStore.setItemAsync(
        CONSENT_KEY,
        String(Date.now() + REMEMBER_MS),
    ).catch(() => undefined);
}

/** Turning 18+ off in settings drops the device consent too, like the web's `clearNsfwConsent`. */
export function clearNsfwConsent() {
    useNsfwConsentStore.setState({ consented: false });
    SecureStore.deleteItemAsync(CONSENT_KEY).catch(() => undefined);
}
