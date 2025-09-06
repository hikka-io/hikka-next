'use client';

import {
    AnimeResponse,
    ContentTypeEnum,
    MangaResponse,
    NovelResponse,
    ReadResponseBase,
    WatchResponseBase,
} from '@hikka/client';
import { useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { MaterialSymbolsMoreVert } from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';

import { ReadEditModal, WatchEditModal } from '@/features/modals';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    number: number;
    content: MangaResponse | NovelResponse | AnimeResponse;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
    record?: ReadResponseBase | WatchResponseBase;
}

const NumberCell: FC<Props> = ({ number, content, content_type, record }) => {
    const params = useParams();
    const { openModal } = useModalContext();
    const { user: loggedUser } = useSession();

    const openWatchEditModal = () => {
        openModal({
            content:
                content_type === ContentTypeEnum.ANIME ? (
                    <WatchEditModal
                        watch={record as WatchResponseBase}
                        slug={content.slug}
                    />
                ) : (
                    <ReadEditModal
                        read={record as ReadResponseBase}
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
