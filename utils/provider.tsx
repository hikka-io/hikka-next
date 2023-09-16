'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

function Providers({ children }: React.PropsWithChildren) {
    const [client] = React.useState(
        new QueryClient({
            defaultOptions: { queries: { staleTime: 60 * 1000 } },
        }),
    );

    return (
        <QueryClientProvider client={client}>
            <ReactQueryStreamedHydration>
                {children}
            </ReactQueryStreamedHydration>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default Providers;
