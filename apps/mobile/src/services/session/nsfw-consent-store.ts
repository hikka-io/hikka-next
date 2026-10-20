import { useEffect } from 'react';

import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { useSessionUI } from './use-session-ui';

// A guest's remembered consent, until the MMKV prefs store exists; the value is its expiry in ms.
const CONSENT_KEY = 'nsfw-consent';
// The web's consent cookie lasts 7 days ("Вибір буде збережено на 7 днів").
const REMEMBER_MS = 7 * 24 * 60 * 60 * 1000;

const readStoredExpiry = () => {
    try {
        const until = Number(SecureStore.getItem(CONSENT_KEY));
        return Number.isFinite(until) && until > 0 ? until : null;
    } catch {
        return null;
    }
};

type State = {
    /** Granted for this launch, like the web's session flag. */
    session: boolean;
    /** A guest's remembered consent: its expiry in ms. */
    until: number | null;
};

const useNsfwConsentStore = create<State>(() => ({
    session: false,
    until: readStoredExpiry(),
}));

const forgetStoredConsent = () => {
    useNsfwConsentStore.setState({ until: null });
    SecureStore.deleteItemAsync(CONSENT_KEY).catch(() => undefined);
};

/** The 18+ consent given on this device: for this launch, or remembered by a guest for 7 days. */
export function useNsfwConsent() {
    const session = useNsfwConsentStore((state) => state.session);
    const until = useNsfwConsentStore((state) => state.until);
    const expired = until !== null && until <= Date.now();

    useEffect(() => {
        if (expired) forgetStoredConsent();
    }, [expired]);

    return session || (until !== null && !expired);
}

/** Whether 18+ content may show: the saved preference or a device consent. `isPending` while a signed-in viewer's preference loads. */
export function useNsfwAllowed() {
    const consented = useNsfwConsent();
    const { showNsfw, isPending } = useSessionUI();
    const allowed = consented || showNsfw;

    return { allowed, isPending: !allowed && isPending };
}

export function grantNsfwConsent({ remember }: { remember: boolean }) {
    if (!remember) {
        useNsfwConsentStore.setState({ session: true });
        return;
    }
    const until = Date.now() + REMEMBER_MS;
    useNsfwConsentStore.setState({ session: true, until });
    SecureStore.setItemAsync(CONSENT_KEY, String(until)).catch(() => undefined);
}

/** Turning 18+ off in settings drops the device consent too, like the web's `clearNsfwConsent`. */
export function clearNsfwConsent() {
    useNsfwConsentStore.setState({ session: false });
    forgetStoredConsent();
}
