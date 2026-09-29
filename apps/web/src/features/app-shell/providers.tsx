import type { FC, PropsWithChildren } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { EffectsManager } from '@/features/effects';
import ThemeProvider from '@/services/theme-provider';
import { applyDefaultLocale } from '@/utils/i18n/locale';

import UIStylesSyncer from './ui-styles-syncer';
import VisualViewportSyncer from './visual-viewport-syncer';

applyDefaultLocale();

type Props = PropsWithChildren & {
    serverTheme?: 'light' | 'dark' | 'system' | null;
};

const Providers: FC<Props> = ({ children, serverTheme }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme={serverTheme ?? 'dark'}
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider delay={0}>
                <UIStylesSyncer />
                <VisualViewportSyncer />
                <EffectsManager />
                {children}
            </TooltipProvider>
        </ThemeProvider>
    );
};

export default Providers;
