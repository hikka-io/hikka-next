'use client';

import { FC, Fragment, memo } from 'react';

import { Button } from '@/components/ui/button';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import ClientCreateModal from '@/features/modals/client-modal/client-create-modal';

import useSession from '@/services/hooks/auth/use-session';
import { useModalContext } from '@/services/providers/modal-provider';

const ClientCreateButton: FC = () => {
    const { user: loggedUser } = useSession();
    const { openModal } = useModalContext();

    const handleCreate = () => {
        openModal({
            content: <ClientCreateModal />,
            className: '!max-w-xl',
            title: 'Створення застосунку',
            forceModal: true,
        });
    };

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                size="icon-sm"
                variant="outline"
                onClick={handleCreate}
            >
                <MaterialSymbolsAddRounded />
            </Button>
        </Fragment>
    );
};

export default memo(ClientCreateButton);