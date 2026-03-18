'use client';

import { ReactNode, useCallback, useState } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import WidgetSettingsContent from '../feed-widgets/components/widget-settings-modal';

export const useOpenWidgetSettings = (): {
    openSettings: () => void;
    settingsModal: ReactNode;
} => {
    const [open, setOpen] = useState(false);

    const openSettings = useCallback(() => {
        setOpen(true);
    }, []);

    const settingsModal = (
        <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
            <ResponsiveModalContent className="!max-w-xl" title="Налаштувати віджети" description="Змінюйте порядок та відображення доступних віджетів">
                <WidgetSettingsContent />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );

    return { openSettings, settingsModal };
};
