'use client';

import { uk } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import { SnackbarProvider } from 'notistack';
import NProgress from 'nprogress';
import React, { PropsWithChildren, useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import SnackbarItem from '@/app/_components/SnackbarItem';
import { SnackbarUtilsConfigurator } from '@/utils/SnackbarUtils';
import AuthProvider from '@/utils/providers/AuthProvider';
import ModalProvider from '@/utils/providers/ModalProvider';
import PoppperProvider from '@/utils/providers/PopperProvider';
import ThemeProvider from '@/utils/providers/ThemeProvider';

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
        <ThemeProvider>
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
                autoHideDuration={3000}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <SnackbarUtilsConfigurator />
                <PoppperProvider>
                    <ModalProvider>
                        <AuthProvider>
                            <QueryClientProvider client={client}>
                                {children}
                                <ReactQueryDevtools initialIsOpen={false} />
                            </QueryClientProvider>
                        </AuthProvider>
                    </ModalProvider>
                </PoppperProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default Providers;
