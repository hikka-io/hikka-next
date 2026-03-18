'use client';

import { ClientResponse } from '@hikka/client';
import { useSession } from '@hikka/react';
import { FC, Fragment, memo, useState } from 'react';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';

import { ClientEditModal } from '@/features/oauth';

interface Props {
    client: ClientResponse;
}

const ClientEditButton: FC<Props> = ({ client }) => {
    const { user: loggedUser } = useSession();
    const [open, setOpen] = useState(false);

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                className="hidden sm:flex"
                onClick={() => setOpen(true)}
                variant="outline"
                size="icon-sm"
            >
                <MaterialSymbolsEditRounded />
            </Button>
            <Button
                className="flex w-full sm:hidden"
                onClick={() => setOpen(true)}
                variant="outline"
                size="icon-sm"
            >
                <MaterialSymbolsEditRounded />
                Редагувати
            </Button>
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent className="!max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>
                            {client.name}
                        </ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    <ClientEditModal
                        client={client}
                        onClose={() => setOpen(false)}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </Fragment>
    );
};

export default memo(ClientEditButton);
