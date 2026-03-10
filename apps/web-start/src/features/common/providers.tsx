'use client';

import { HikkaProvider } from '@hikka/react';
import { MutationCache, QueryClientConfig } from '@hikka/react/core';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

import EffectsManager from '@/features/common/effects-manager';
import { TooltipProvider } from '@/components/ui/tooltip';
import ModalProvider from '@/services/providers/modal-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { useUIStore } from '@/services/providers/ui-store-provider';

interface Props extends PropsWithChildren {}

const Providers: FC<Props> = ({ children }) => {
    const UI = useUIStore((state) => state);
    setDefaultOptions({ locale: uk });

    const [queryClientConfig] = useState<QueryClientConfig>({
        mutationCache: new MutationCache({
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    });

    return (
        <HikkaProvider
            defaultOptions={{
                title: UI.preferences?.title_language ?? 'title_ua',
                name: UI.preferences?.name_language ?? 'name_ua',
            }}
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
                        <EffectsManager />
                        {children}
                    </ModalProvider>
                </TooltipProvider>
            </ThemeProvider>
        </HikkaProvider>
    );
};

export default Providers;
