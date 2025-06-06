'use client';

import {
    MangaResponse,
    NovelResponse,
    ReadContentType,
    ReadResponseBase,
} from '@hikka/client';
import { useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { MaterialSymbolsMoreVert } from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import ReadEditModal from '../../../../modals/read-edit-modal.component';

interface Props {
    number: number;
    content: MangaResponse | NovelResponse;
    content_type: ReadContentType;
    read?: ReadResponseBase;
}

const NumberCell: FC<Props> = ({ number, content, content_type, read }) => {
    const params = useParams();
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    const openWatchEditModal = () => {
        openModal({
            content: (
                <ReadEditModal
                    read={read}
                    content_type={content_type}
                    slug={content.slug}
                />
            ),
            className: '!max-w-xl',
            title: content.title,
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
