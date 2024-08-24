'use client';

import { FC, Fragment, memo } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import { Button } from '@/components/ui/button';

import ClientEditModal from '@/features/modals/client-modal/client-edit-modal';

import useSession from '@/services/hooks/auth/use-session';
import { useModalContext } from '@/services/providers/modal-provider';

interface Props {
    client: API.Client;
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
                className="flex sm:hidden w-full"
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
