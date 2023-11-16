'use client';

import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from '@/utils/providers/AuthProvider';
import ModalProvider from '@/utils/providers/ModalProvider';

interface Props extends PropsWithChildren {}

function Providers({ children }: Props) {
    const [client] = React.useState(
        new QueryClient({
            defaultOptions: { queries: { staleTime: 60 * 1000, retry: false } },
        }),
    );

    return (
        <ModalProvider>
            <AuthProvider>
                <QueryClientProvider client={client}>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </AuthProvider>
        </ModalProvider>
    );
}

export default Providers;
