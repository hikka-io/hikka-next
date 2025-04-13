'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import MaterialSymbolsMoreVert from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';
import useSession from '@/services/hooks/auth/use-session';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';
import WatchEditModal from '../../../../modals/watch-edit-modal.component';

interface Props {
    number: number;
    anime: API.Anime;
    watch?: API.Watch;
}

const NumberCell: FC<Props> = ({ number, anime, watch }) => {
    const params = useParams();
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    const openWatchEditModal = () => {
        openModal({
            content: <WatchEditModal watch={watch} slug={anime.slug} />,
            className: '!max-w-xl',
            title: anime.title,
            forceModal: true,
        });
    };

    return (
        <TableCell className="w-12 pr-0">
            {loggedUser?.username === params.username && (
                <Button
                    size="icon-sm"
                    className="hidden group-hover:flex"
                    onClick={openWatchEditModal}
                >
                    <MaterialSymbolsMoreVert />
                </Button>
            )}
            <Label
                className={cn(
                    'text-muted-foreground',
                    loggedUser?.username === params.username &&
                        'inline group-hover:hidden',
                )}
            >
                {number}
            </Label>
        </TableCell>
    );
};

export default NumberCell;
