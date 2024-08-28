'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';
import MaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';

import ReadEditModal from '@/features/modals/read-edit-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    number: number;
    content: API.Manga | API.Novel;
    content_type: 'manga' | 'novel';
    read?: API.Read;
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
