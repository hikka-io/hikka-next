'use client';

import { ReactNode, useCallback, useState } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalDescription,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
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
            <ResponsiveModalContent className="!max-w-xl">
                <ResponsiveModalHeader>
                    <ResponsiveModalTitle>Налаштувати віджети</ResponsiveModalTitle>
                    <ResponsiveModalDescription>
                        Змінюйте порядок та відображення доступних віджетів
                    </ResponsiveModalDescription>
                </ResponsiveModalHeader>
                <WidgetSettingsContent />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );

    return { openSettings, settingsModal };
};
