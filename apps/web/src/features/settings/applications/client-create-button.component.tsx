'use client';

import { useSession } from '@hikka/react';
import { FC, Fragment, memo } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { Button } from '@/components/ui/button';

import { useModalContext } from '@/services/providers/modal-provider';

import ClientCreateModal from '../../modals/client-modal/client-create-modal.component';

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
            <Button size="icon-sm" variant="outline" onClick={handleCreate}>
                <MaterialSymbolsAddRounded />
            </Button>
        </Fragment>
    );
};

export default memo(ClientCreateButton);
