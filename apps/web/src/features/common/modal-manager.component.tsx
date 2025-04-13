'use client';

import { useSearchParams } from 'next/navigation';
import { memo, useEffect } from 'react';

import { useModalContext } from '../../services/providers/modal-provider';
import AuthModal from '../modals/auth-modal/auth-modal.component';

const ModalManager = () => {
    const { openModal } = useModalContext();
    const searchParams = useSearchParams();
    const modal = searchParams.get('modal');

    const handleModal = (modal: string) => {
        switch (modal) {
            case 'passwordConfirm':
                openModal({
                    content: <AuthModal type="passwordConfirm" />,
                    className: 'max-w-3xl p-0',
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
