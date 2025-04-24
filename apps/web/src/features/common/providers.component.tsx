'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { HikkaClientConfig } from '@hikka/client';
import { HikkaProvider } from '@hikka/react';
import { MutationCache, QueryClientConfig } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

import ModalProvider from '@/services/providers/modal-provider';
import SettingsProvider from '@/services/providers/settings-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { convertTitleDeep } from '@/utils/adapters/convert-title';
import { getCookie } from '@/utils/cookies';

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
        defaultOptions: {
            queries: {
                select: (data) =>
                    convertTitleDeep({ data, titleLanguage: 'title_ua' }),
            },
        },
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
            </SettingsProvider>
        </HikkaProvider>
    );
};

export default Providers;
