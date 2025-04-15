'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { HikkaClientConfig } from '@hikka/client';
import { HikkaProvider } from '@hikka/react';
import {
    MutationCache,
    QueryClientConfig,
    QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

import ModalProvider from '@/services/providers/modal-provider';
import SettingsProvider from '@/services/providers/settings-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { getCookie } from '@/utils/cookies';
import { createQueryClient } from '@/utils/get-query-client';

import SnackbarItem from '../../components/snackbar-item';

interface Props extends PropsWithChildren {}

const Providers: FC<Props> = ({ children }) => {
    setDefaultOptions({ locale: uk });

    const [queryClientConfig] = useState<QueryClientConfig>({
        mutationCache: new MutationCache({
            onError: (error, vars, context, mutation) => {
                enqueueSnackbar(error.message, {
                    variant: 'error',
                });
            },
        }),
    });

    const [queryClient] = useState(() => createQueryClient(queryClientConfig));

    const [apiClientConfig, setApiClientConfig] = useState<HikkaClientConfig>({
        baseUrl: 'https://api.hikka.io',
    });

    useEffect(() => {
        getCookie('auth').then(
            (authToken) =>
                authToken &&
                setApiClientConfig({ ...apiClientConfig, authToken }),
        );
    }, []);

    return (
        <HikkaProvider
            clientConfig={apiClientConfig}
            queryClientConfig={queryClientConfig}
        >
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
        </HikkaProvider>
    );
};

export default Providers;
