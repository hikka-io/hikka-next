'use client';

import { ClientResponse } from '@hikka/client';
import { useSession } from '@hikka/react';
import { FC, Fragment, memo } from 'react';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import { Button } from '@/components/ui/button';

import { useModalContext } from '@/services/providers/modal-provider';

import ClientEditModal from '../../modals/client-modal/client-edit-modal.component';

interface Props {
    client: ClientResponse;
}

const ClientEditButton: FC<Props> = ({ client }) => {
    const { user: loggedUser } = useSession();
    const { openModal } = useModalContext();

    const handleEdit = () => {
        openModal({
            content: <ClientEditModal client={client} />,
            className: '!max-w-xl',
            title: client.name,
            forceModal: true,
        });
    };

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                className="hidden sm:flex"
                onClick={handleEdit}
                variant="outline"
                size="icon-sm"
            >
                <MaterialSymbolsEditRounded />
            </Button>
            <Button
                className="flex w-full sm:hidden"
                onClick={handleEdit}
                variant="outline"
                size="icon-sm"
            >
                <MaterialSymbolsEditRounded />
                Редагувати
            </Button>
        </Fragment>
    );
};

export default memo(ClientEditButton);
