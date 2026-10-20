import NetInfo from '@react-native-community/netinfo';
import {
    focusManager,
    onlineManager,
    QueryClient,
} from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

import { DEFAULT_BASE_URL } from '@hikka/api';
import type { QueryId } from '@hikka/core';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL;

onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => setOnline(!!state.isConnected)),
);

AppState.addEventListener('change', (status) => {
    if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

/**
 * Per-key tiers, like the web's `QUERY_DEFAULT_TIERS`: lookups that change with a release,
 * not a session. Generated keys are `[{ _id, … }]`, matched partially by `_id`.
 */
const STATIC_QUERY_IDS = [
    'genres',
    'searchCompanies',
] as const satisfies readonly QueryId[];

for (const id of STATIC_QUERY_IDS) {
    queryClient.setQueryDefaults([{ _id: id }], {
        staleTime: Number.POSITIVE_INFINITY,
    });
}
