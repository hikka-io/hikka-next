'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from '@/utils/providers/AuthProvider';
import ModalProvider from '@/utils/providers/ModalProvider';
import { SnackbarProvider } from 'notistack';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import SnackbarItem from '@/app/_components/SnackbarItem';
import setDefaultOptions from "date-fns/setDefaultOptions";
import {uk} from "date-fns/locale";

interface Props extends PropsWithChildren {}

function Providers({ children }: Props) {
    setDefaultOptions({ locale: uk });
    const [client] = React.useState(
        new QueryClient({
            defaultOptions: { queries: { staleTime: 60 * 1000, retry: false } },
        }),
    );

    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    return (
        <SnackbarProvider
            Components={{
                default: SnackbarItem,
                success: SnackbarItem,
                error: SnackbarItem,
                warning: SnackbarItem,
                info: SnackbarItem,
            }}
            maxSnack={2}
            preventDuplicate
            autoHideDuration={2000}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <ModalProvider>
                <AuthProvider>
                    <QueryClientProvider client={client}>
                        {children}
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </AuthProvider>
            </ModalProvider>
        </SnackbarProvider>
    );
}

export default Providers;
