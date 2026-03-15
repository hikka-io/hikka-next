import { HikkaClient } from '@hikka/client';
import { HikkaContextProvider } from '@hikka/react';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { FC, PropsWithChildren } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import EffectsManager from '@/features/common/effects-manager';
import ModalProvider from '@/services/providers/modal-provider';
import ThemeProvider from '@/services/providers/theme-provider';
import { useUIStore } from '@/services/providers/ui-store-provider';

interface Props extends PropsWithChildren {
    client: HikkaClient;
    serverTheme?: 'light' | 'dark' | 'system' | null;
}

const Providers: FC<Props> = ({ children, client, serverTheme }) => {
    const UI = useUIStore((state) => state);
    setDefaultOptions({ locale: uk });

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
                defaultTheme={serverTheme ?? 'dark'}
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
        </HikkaContextProvider>
    );
};

export default Providers;
