'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { HikkaClient } from '@hikka/client';
import { MutationCache, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

import { APIClientProvider } from '@/services/providers/api-client-provider';
import ModalProvider from '@/services/providers/modal-provider';
import SettingsProvider from '@/services/providers/settings-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { getCookie } from '@/utils/cookies';
import { createAPIClient } from '@/utils/get-api-client';
import { createQueryClient } from '@/utils/get-query-client';

import SnackbarItem from '../../components/snackbar-item';

interface Props extends PropsWithChildren {}

const Providers: FC<Props> = ({ children }) => {
    setDefaultOptions({ locale: uk });

    const [queryClient] = useState(() =>
        createQueryClient({
            mutationCache: new MutationCache({
                onError: (error, vars, context, mutation) => {
                    enqueueSnackbar(error.message, {
                        variant: 'error',
                    });
                },
            }),
        }),
    );

    const [apiClient] = useState<HikkaClient>(createAPIClient);

    useEffect(() => {
        getCookie('auth').then(
            (authToken) => authToken && apiClient?.setAuthToken(authToken),
        );
    }, []);

    return (
        <APIClientProvider client={apiClient}>
            <SettingsProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryClientProvider client={queryClient}>
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
                            anchorOrigin={{
                                horizontal: 'right',
                                vertical: 'bottom',
                            }}
                        >
                            <TooltipProvider delayDuration={0}>
                                <ModalProvider>
                                    <ProgressProvider
                                        height="4px"
                                        color="#e779c1"
                                        options={{
                                            showSpinner: false,
                                            easing: 'ease',
                                            trickle: true,
                                        }}
                                        shallowRouting
                                    />

                                    {children}
                                    <ReactQueryDevtools initialIsOpen={false} />
                                </ModalProvider>
                            </TooltipProvider>
                        </SnackbarProvider>
                    </QueryClientProvider>
                </ThemeProvider>
            </SettingsProvider>
        </APIClientProvider>
    );
};

export default Providers;
