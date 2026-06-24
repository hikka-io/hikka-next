import { type FC, Fragment, memo, useState } from 'react';

import { useSession } from '@hikka/react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import ClientCreateModal from './applications/client-create-modal';

const ClientCreateButton: FC = () => {
    const { user: loggedUser } = useSession();
    const [open, setOpen] = useState(false);

    if (!loggedUser) return null;

    return (
        <Fragment>
            <Button
                size="icon-sm"
                variant="outline"
                onClick={() => setOpen(true)}
            >
                <MaterialSymbolsAddRounded />
            </Button>
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent
                    className="md:max-w-xl"
                    title="Створення застосунку"
                >
                    <ClientCreateModal onClose={() => setOpen(false)} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </Fragment>
    );
};

export default memo(ClientCreateButton);
