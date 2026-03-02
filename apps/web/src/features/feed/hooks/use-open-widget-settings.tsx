'use client';

import { useCallback } from 'react';

import { useModalContext } from '@/services/providers/modal-provider';

import WidgetSettingsContent from '../feed-widgets/components/widget-settings-modal';

export const useOpenWidgetSettings = () => {
    const { openModal } = useModalContext();

    return useCallback(() => {
        openModal({
            content: <WidgetSettingsContent />,
            title: 'Налаштувати віджети',
            forceModal: true,
        });
    }, [openModal]);
};
