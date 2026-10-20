import NetInfo from '@react-native-community/netinfo';
import {
    focusManager,
    onlineManager,
    QueryClient,
} from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

import { DEFAULT_BASE_URL } from '@hikka/api';

import { applyQueryDefaults } from './query-defaults';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL;

onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)),
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
        // A write offline fails at once with the network copy instead of waiting to replay a stale full-snapshot PUT later.
        mutations: { networkMode: 'always' },
    },
});

applyQueryDefaults(queryClient);
