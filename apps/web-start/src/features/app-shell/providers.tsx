import type { FC, PropsWithChildren } from 'react';

import { uk } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';

import { TooltipProvider } from '@/components/ui/tooltip';
import EffectsManager from '@/features/effects/effects-manager';
import ThemeProvider from '@/services/providers/theme-provider';

import UIStylesSyncer from './ui-styles-syncer';
import VisualViewportSyncer from './visual-viewport-syncer';

setDefaultOptions({ locale: uk });

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
            <TooltipProvider delayDuration={0}>
                <UIStylesSyncer />
                <VisualViewportSyncer />
                <EffectsManager />
                {children}
            </TooltipProvider>
        </ThemeProvider>
    );
};

export default Providers;
