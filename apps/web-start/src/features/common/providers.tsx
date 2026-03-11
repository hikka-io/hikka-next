import { HikkaClient } from '@hikka/client';
import { HikkaContextProvider } from '@hikka/react';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, PropsWithChildren, useEffect } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import EffectsManager from '@/features/common/effects-manager';
import ModalProvider from '@/services/providers/modal-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { useUIStore } from '@/services/providers/ui-store-provider';
import { parseAuthCookie } from '@/utils/cookies/parse';

interface Props extends PropsWithChildren {
    client: HikkaClient;
}

const Providers: FC<Props> = ({ children, client }) => {
    const UI = useUIStore((state) => state);
    setDefaultOptions({ locale: uk });

    // Read auth token from document.cookie on mount for client-side availability
    useEffect(() => {
        const authToken = parseAuthCookie(document.cookie);
        if (authToken) {
            client.setAuthToken(authToken);
        }
    }, [client]);

    return (
        <HikkaContextProvider
            client={client}
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
            <ReactQueryDevtools initialIsOpen={false} />
        </HikkaContextProvider>
    );
};

export default Providers;
