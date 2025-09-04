'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { HikkaClientConfig } from '@hikka/client';
import { HikkaProvider } from '@hikka/react';
import { MutationCache, QueryClientConfig } from '@hikka/react/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';

import ModalProvider from '@/services/providers/modal-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { useSettingsStore } from '@/services/stores/settings-store';
import { getCookie } from '@/utils/cookies';

interface Props extends PropsWithChildren {}

const Providers: FC<Props> = ({ children }) => {
    const settings = useSettingsStore();
    setDefaultOptions({ locale: uk });

    const [queryClientConfig] = useState<QueryClientConfig>({
        mutationCache: new MutationCache({
            onError: (error) => {
                toast.error(error.message);
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
            </ThemeProvider>
        </HikkaProvider>
    );
};

export default Providers;
