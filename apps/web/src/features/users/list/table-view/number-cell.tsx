import { type FC, useState } from 'react';

import {
    type AnimeResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type MangaResponse,
    type NovelResponse,
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';

import { MaterialSymbolsMoreVert } from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { ListEntryEditDialog } from '@/components/tracking';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableCell } from '@/components/ui/table';
import { useSession } from '@/features/auth/hooks/use-session';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

type Props = {
    number: number;
    content: MangaResponse | NovelResponse | AnimeResponse;
    content_type: MainContentTypeEnum;
    record?: ReadResponseBase | WatchResponseBase;
};

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
            <ListEntryEditDialog
                open={open}
                onOpenChange={setOpen}
                content={content}
                slug={content.slug}
                {...(content_type === ContentTypeEnum.ANIME
                    ? {
                          contentType: content_type,
                          watch: record as WatchResponseBase,
                      }
                    : {
                          contentType: content_type,
                          read: record as ReadResponseBase,
                      })}
            />
        </TableCell>
    );
};

export default NumberCell;
