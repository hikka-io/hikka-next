import { HikkaClient } from '@hikka/client';
import { HikkaContextProvider } from '@hikka/react';
import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { FC, PropsWithChildren } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

import EffectsManager from '@/features/common/effects-manager';
import UIStylesSyncer from '@/features/common/ui-styles-syncer';
import VisualViewportSyncer from '@/features/common/visual-viewport-syncer';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import ThemeProvider from '@/services/providers/theme-provider';

setDefaultOptions({ locale: uk });

interface Props extends PropsWithChildren {
    client: HikkaClient;
    serverTheme?: 'light' | 'dark' | 'system' | null;
}

const Providers: FC<Props> = ({ children, client, serverTheme }) => {
    const { preferences } = useSessionUI();

    return (
        <HikkaContextProvider
            client={client}
            defaultOptions={{
                title: preferences.title_language ?? 'title_ua',
                name: preferences.name_language ?? 'name_ua',
            }}
        >
            <ThemeProvider
                attribute="class"
                defaultTheme={serverTheme ?? 'dark'}
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider delayDuration={0}>
                    <UIStylesSyncer />
                    <VisualViewportSyncer />
                    <EffectsManager />
                    {children}
                </TooltipProvider>
            </ThemeProvider>
        </HikkaContextProvider>
    );
};

export default Providers;
