import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { cn } from '@/utils/cn';
import { DEFAULT_STYLES, diffStyles } from '@/utils/ui';

/**
 * Resets appearance styles (brand, radius, backdrop, overrides) to defaults.
 * Always rendered so it never shifts the section header height — it's just
 * hidden (space reserved) until the user has customized something.
 */
const StylesResetButton = () => {
    const { styles } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const isCustomized = diffStyles(styles) !== undefined;

    const resetToDefaults = () => {
        document.documentElement.style.removeProperty('--brand');
        document.documentElement.style.removeProperty('--backdrop-intensity');
        update({ styles: { ...DEFAULT_STYLES } });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            disabled={!isCustomized}
            aria-hidden={!isCustomized}
            tabIndex={isCustomized ? undefined : -1}
            className={cn(!isCustomized && 'invisible')}
        >
            <RotateCcw className="size-4" />
            Скинути
        </Button>
    );
};

export default StylesResetButton;
