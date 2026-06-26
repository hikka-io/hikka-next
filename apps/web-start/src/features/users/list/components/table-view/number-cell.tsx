import { type ComponentProps, type FC, useState } from 'react';

import {
    type AnimeResponse,
    ContentTypeEnum,
    type MangaResponse,
    type NovelResponse,
    type ReadResponseBase,
    type WatchResponseBase,
} from '@hikka/api';
import { useSession, useTitle } from '@hikka/react';

import { ReadEditModal, WatchEditModal } from '@/components/action-buttons';
import { MaterialSymbolsMoreVert } from '@/components/icons/material-symbols/MaterialSymbolsMoreVert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

type Props = {
    number: number;
    content: MangaResponse | NovelResponse | AnimeResponse;
    content_type: 'anime' | 'manga' | 'novel';
    record?: ReadResponseBase | WatchResponseBase;
};

const NumberCell: FC<Props> = ({ number, content, content_type, record }) => {
    const params = useParams();
    const { user: loggedUser } = useSession();
    const title = useTitle(content as unknown as Record<string, unknown>);
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
                <ResponsiveModalContent className="md:max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    {content_type === ContentTypeEnum.ANIME ? (
                        <WatchEditModal
                            watch={
                                // TODO(phase2): drop cast once action-buttons is on @hikka/api
                                record as unknown as ComponentProps<
                                    typeof WatchEditModal
                                >['watch']
                            }
                            slug={content.slug}
                            onClose={() => setOpen(false)}
                        />
                    ) : (
                        <ReadEditModal
                            read={
                                // TODO(phase2): drop cast once action-buttons is on @hikka/api
                                record as unknown as ComponentProps<
                                    typeof ReadEditModal
                                >['read']
                            }
                            content_type={
                                content_type as ComponentProps<
                                    typeof ReadEditModal
                                >['content_type']
                            }
                            slug={content.slug}
                            onClose={() => setOpen(false)}
                        />
                    )}
                </ResponsiveModalContent>
            </ResponsiveModal>
        </TableCell>
    );
};

export default NumberCell;
