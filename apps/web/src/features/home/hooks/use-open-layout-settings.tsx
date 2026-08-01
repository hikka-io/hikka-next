import { type ReactNode, useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
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
        <ResponsiveModal open={open} onOpenChange={setOpen} mobile="page">
            <ResponsiveModalContent
                className="md:min-h-112 md:max-w-3xl"
                title="Налаштувати макет сторінки"
                description="Оберіть тип макету, налаштуйте віджети та їх порядок"
            >
                <LayoutSettingsContent />
                <ResponsiveModalFooter>
                    <Button size="md" onClick={() => setOpen(false)}>
                        Готово
                    </Button>
                </ResponsiveModalFooter>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );

    return { openSettings, settingsModal };
};
