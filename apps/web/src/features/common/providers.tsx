'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { HikkaClientConfig, UserAppearance } from '@hikka/client';
import { HikkaProvider } from '@hikka/react';
import { MutationCache, QueryClientConfig } from '@hikka/react/core';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { toast } from 'sonner';

import EffectsManager from '@/components/effects-manager';
import { TooltipProvider } from '@/components/ui/tooltip';

import ModalProvider from '@/services/providers/modal-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import {
    UIStoreProvider,
    useUIStore,
    useUIStoreApi,
} from '@/services/providers/ui-store-provider';
import { applyStyles } from '@/utils/appearance';
import { getCookie } from '@/utils/cookies';

interface Props extends PropsWithChildren {
    initialUIData: UserAppearance;
}

const Providers: FC<Props> = ({ children, initialUIData }) => {
    const appearance = useUIStore((state) => state);
    const uiStore = useUIStoreApi();
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

    useEffect(() => {
        // Keep injected CSS in sync with the UI store state.
        applyStyles(uiStore.getState().getMergedStyles());

        return uiStore.subscribe((state, prevState) => {
            if (state.styles !== prevState.styles) {
                applyStyles(uiStore.getState().getMergedStyles());
            }
        });
    }, [uiStore]);

    return (
        <UIStoreProvider initialUIData={initialUIData}>
            <HikkaProvider
                defaultOptions={{
                    title: appearance.preferences?.title_language ?? 'title_ua',
                    name: appearance.preferences?.name_language ?? 'name_ua',
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
                            <EffectsManager />
                            {children}
                        </ModalProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </HikkaProvider>
        </UIStoreProvider>
    );
};

export default Providers;
