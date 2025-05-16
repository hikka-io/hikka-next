'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { HikkaClientConfig } from '@hikka/client';
import { HikkaProvider } from '@hikka/react';
import { MutationCache, QueryClientConfig } from '@hikka/react/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

import ModalProvider from '@/services/providers/modal-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { useSettingsStore } from '@/services/stores/settings-store';
import { getCookie } from '@/utils/cookies';

import SnackbarItem from '../../components/snackbar-item';

interface Props extends PropsWithChildren {}

const Providers: FC<Props> = ({ children }) => {
    const settings = useSettingsStore();
    setDefaultOptions({ locale: uk });

    const [queryClientConfig] = useState<QueryClientConfig>({
        mutationCache: new MutationCache({
            onError: (error) => {
                enqueueSnackbar(error.message, {
                    variant: 'error',
                });
            },
        }),
    });

    const [apiClientConfig, setApiClientConfig] = useState<HikkaClientConfig>({
        baseUrl: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
    });
    useEffect(() => {
        getCookie('auth').then(
            (authToken) =>
                authToken &&
                setApiClientConfig((config) => ({ ...config, authToken })),
        );
    }, []);

    return (
        <HikkaProvider
            defaultOptions={{
                title: settings.titleLanguage,
                name: settings.nameLanguage,
            }}
            clientConfig={apiClientConfig}
            queryClientConfig={queryClientConfig}
        >
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
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
            </ThemeProvider>
        </HikkaProvider>
    );
};

export default Providers;
