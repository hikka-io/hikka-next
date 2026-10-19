import { useSyncExternalStore } from 'react';

import * as SecureStore from 'expo-secure-store';

import { getAuthToken, setAuthToken } from '@hikka/api';

const AUTH_TOKEN_KEY = 'auth-token';

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

export function restoreAuthToken() {
    setAuthToken(SecureStore.getItem(AUTH_TOKEN_KEY) ?? undefined);
}

export async function storeAuthToken(token: string | undefined) {
    if (token) await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);

    setAuthToken(token);
    for (const listener of listeners) listener();
}

export const useAuthToken = () => useSyncExternalStore(subscribe, getAuthToken);
