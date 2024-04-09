'use client';

import React, { memo, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import AuthModal from '@/components/modals/auth-modal';
import { useModalContext } from '@/services/providers/modal-provider';

export default memo(function ModalManager() {
    const { openModal } = useModalContext();
    const searchParams = useSearchParams();
    const modal = searchParams.get('modal');

    useEffect(() => {
        if (modal) {
            switch (modal) {
                case 'passwordConfirm':
                    openModal({
                        content: <AuthModal type="passwordConfirm" />,
                        className: 'p-0 max-w-3xl',
                    });
                    break;
            }
        }
    }, [modal]);

    return null;
});
