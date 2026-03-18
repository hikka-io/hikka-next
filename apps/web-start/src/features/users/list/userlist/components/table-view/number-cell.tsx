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
import { useParams } from '@/utils/navigation';
import { FC, useState } from 'react';

import { MaterialSymbolsMoreVert } from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';

import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';

import { ReadEditModal } from '@/features/read';
import { WatchEditModal } from '@/features/watch';

import { cn } from '@/utils/cn';

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
    const { user: loggedUser } = useSession();
    const [open, setOpen] = useState(false);

    return (
        <TableCell className="w-12 pr-0">
            {loggedUser?.username === params.username && (
                <Button
                    size="icon-sm"
                    className="hidden group-hover:flex"
                    onClick={() => setOpen(true)}
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
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent className="!max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{content.title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    {content_type === ContentTypeEnum.ANIME ? (
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
                    )}
                </ResponsiveModalContent>
            </ResponsiveModal>
        </TableCell>
    );
};

export default NumberCell;
