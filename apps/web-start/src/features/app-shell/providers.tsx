import { type FC, type PropsWithChildren, useMemo } from 'react';

import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';

import type { HikkaClient } from '@hikka/client';
import { HikkaContextProvider } from '@hikka/react';

import { TooltipProvider } from '@/components/ui/tooltip';
import EffectsManager from '@/features/effects/effects-manager';
import UIStylesSyncer from './ui-styles-syncer';
import VisualViewportSyncer from './visual-viewport-syncer';
import { useSessionUI } from '@/services/hooks/use-session-ui';
import ThemeProvider from '@/services/providers/theme-provider';

setDefaultOptions({ locale: uk });

type Props = PropsWithChildren & {
    client: HikkaClient;
    serverTheme?: 'light' | 'dark' | 'system' | null;
};

const Providers: FC<Props> = ({ children, client, serverTheme }) => {
    const { preferences } = useSessionUI();

    const defaultOptions = useMemo(
        () => ({
            title: preferences.title_language ?? 'title_ua',
            name: preferences.name_language ?? 'name_ua',
        }),
        [preferences.title_language, preferences.name_language],
    );

    return (
        <HikkaContextProvider client={client} defaultOptions={defaultOptions}>
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
