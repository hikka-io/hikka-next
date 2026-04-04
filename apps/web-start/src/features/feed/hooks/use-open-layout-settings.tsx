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
        <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
            <ResponsiveModalContent
                className="md:max-w-3xl"
                title="Налаштувати макет сторінки"
                description="Оберіть тип макету, налаштуйте віджети та їх порядок"
            >
                <LayoutSettingsContent />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );

    return { openSettings, settingsModal };
};
