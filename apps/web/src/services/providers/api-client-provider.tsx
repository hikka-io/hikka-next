'use client';

import type { HikkaClient } from '@hikka/client';
import * as React from 'react';

export const HikkaClientContext = React.createContext<HikkaClient | undefined>(
    undefined,
);

export const useAPIClient = (apiClient?: HikkaClient) => {
    const client = React.useContext(HikkaClientContext);

    if (apiClient) {
        return apiClient;
    }

    if (!client) {
        throw new Error('No HikkaClient set, use APIClientProvider to set one');
    }

    return client;
};

export type APIClientProviderProps = {
    client: HikkaClient;
    children?: React.ReactNode;
};

export const APIClientProvider = ({
    client,
    children,
}: APIClientProviderProps): React.JSX.Element => {
    return (
        <HikkaClientContext.Provider value={client}>
            {children}
        </HikkaClientContext.Provider>
    );
};
