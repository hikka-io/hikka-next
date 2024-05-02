'use client';

import React, { memo, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import AuthModal from '@/components/modals/auth-modal';
import { useModalContext } from '@/services/providers/modal-provider';

const ModalManager = () => {
    const { openModal } = useModalContext();
    const searchParams = useSearchParams();
    const modal = searchParams.get('modal');

    const handleModal = (modal: string) => {
        switch (modal) {
            case 'passwordConfirm':
                openModal({
                    content: <AuthModal type="passwordConfirm" />,
                    className: 'p-0 max-w-3xl',
                    forceModal: true,
                });
                break;
        }
    };

    useEffect(() => {
        if (modal) {
            handleModal(modal);
        }
    }, [modal]);

    return null;
};

export default memo(ModalManager);
