import { StateStorage, createJSONStorage } from 'zustand/middleware';

export const UI_COOKIE_NAME = 'ui-appearance';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

/**
 * Base cookie storage adapter
 */
const cookieStateStorage: StateStorage = {
    getItem: (name: string): string | null => {
        if (typeof document === 'undefined') return null;

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie
                .split('=')
                .map((c) => c.trim());
            if (cookieName === name) {
                try {
                    return decodeURIComponent(cookieValue);
                } catch {
                    return null;
                }
            }
        }
        return null;
    },

    setItem: (name: string, value: string): void => {
        if (typeof document === 'undefined') return;

        const encodedValue = encodeURIComponent(value);
        document.cookie = `${name}=${encodedValue}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    },

    removeItem: (name: string): void => {
        if (typeof document === 'undefined') return;

        document.cookie = `${name}=; path=/; max-age=0`;
    },
};

/**
 * Cookie storage wrapped for Zustand persist middleware
 */
export const cookieStorage = createJSONStorage(() => cookieStateStorage);

/**
 * Parse appearance from cookie value
 */
export function parseAppearanceFromCookie(
    cookieValue: string | undefined,
): Hikka.UserAppearance | null {
    if (!cookieValue) return null;

    try {
        const parsed = JSON.parse(cookieValue);
        return parsed?.state ?? null;
    } catch {
        return null;
    }
}

