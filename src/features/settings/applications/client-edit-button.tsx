'use client';

import { useSnackbar } from 'notistack';
import { FC, Fragment, createElement, memo } from 'react';

import { Button } from '@/components/ui/button';

import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';
import ClientEditModal from '@/features/modals/client-edit-modal';

import useSession from '@/services/hooks/auth/use-session';
import { useModalContext } from '@/services/providers/modal-provider';


interface Props {
    item: API.Client;
}

const ClientEditButton: FC<Props> = ({ item }) => {
    const { user: loggedUser } = useSession();
    const { openModal } = useModalContext();

    const handleEdit = () => {
        openModal({
            content: (
                <ClientEditModal reference={item.reference} />
            ),
            className: '!max-w-xl',
            title: item.name,
            forceModal: true,
        });
        return;
    };

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                className="hidden sm:flex"
                onClick={handleEdit}
                variant={'outline'}
                size="icon-sm"
            >
                {<MaterialSymbolsEditRounded />}
            </Button>
            <Button
                className="flex sm:hidden w-full"
                onClick={handleEdit}
                variant={'outline'}
                size="icon-sm"
            >
                <MaterialSymbolsEditRounded />
                Редагувати
            </Button>
        </Fragment>
    );
};

export default memo(ClientEditButton);
