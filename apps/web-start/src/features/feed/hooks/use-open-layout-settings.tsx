'use client';

import { ReactNode, useCallback, useState } from 'react';

import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import LayoutSettingsContent from '../layout-settings-modal';

export const useOpenLayoutSettings = (): {
    openSettings: () => void;
    settingsModal: ReactNode;
} => {
    const [open, setOpen] = useState(false);

    const openSettings = useCallback(() => {
        setOpen(true);
    }, []);

    const settingsModal = (
        <ResponsiveModal open={open} onOpenChange={setOpen}>
            <ResponsiveModalContent
                className="md:max-w-3xl"
                title="Налаштувати макет стрічки"
                description="Переміщуйте віджети між колонками, змінюйте порядок та видимість"
            >
                <LayoutSettingsContent />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );

    return { openSettings, settingsModal };
};
