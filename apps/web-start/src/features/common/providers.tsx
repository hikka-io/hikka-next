import { HikkaClient } from '@hikka/client';
import { HikkaProvider } from '@hikka/react';
import { QueryClient } from '@hikka/react/core';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { FC, PropsWithChildren, useEffect } from 'react';

import EffectsManager from '@/features/common/effects-manager';
import { TooltipProvider } from '@/components/ui/tooltip';
import ModalProvider from '@/services/providers/modal-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { useUIStore } from '@/services/providers/ui-store-provider';

interface Props extends PropsWithChildren {
    client: HikkaClient;
    queryClient: QueryClient;
}

const Providers: FC<Props> = ({ children, client, queryClient }) => {
    const UI = useUIStore((state) => state);
    setDefaultOptions({ locale: uk });

    // Read auth token from document.cookie on mount for client-side availability
    useEffect(() => {
        const match = document.cookie.match(/(?:^|;\s*)auth=([^;]*)/);
        if (match) {
            client.setAuthToken(decodeURIComponent(match[1]));
        }
    }, [client]);

    return (
        <HikkaProvider
            client={client}
            queryClient={queryClient}
            defaultOptions={{
                title: UI.preferences?.title_language ?? 'title_ua',
                name: UI.preferences?.name_language ?? 'name_ua',
            }}
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
