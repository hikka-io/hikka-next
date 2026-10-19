import { type FC, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { CopyPlus } from 'lucide-react';

import type { CollectionContentTypeEnum } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { useSession } from '@/services/session';

import {
    ownCollectionsOptions,
    ownContentCollectionsOptions,
} from '../queries';
import AnimatedHeight from './animated-height';
import CollectionPicker from './collection-picker';
import { COLLECTION_PICKER_TITLE as TITLE } from './constants';

type Props = {
    content_type: CollectionContentTypeEnum;
    slug: string;
};

const AddToCollectionButton: FC<Props> = ({ content_type, slug }) => {
    const { user } = useSession();
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const queryClient = useQueryClient();

    const warm = () => {
        if (!user || open) return;
        void queryClient.prefetchInfiniteQuery(
            ownContentCollectionsOptions(user.username, content_type, slug),
        );
        void queryClient.prefetchInfiniteQuery(
            ownCollectionsOptions(user.username, content_type),
        );
    };

    const button = (
        <Button
            variant="ghost"
            size="icon-md"
            disabled={!user}
            aria-label={TITLE}
            onPointerEnter={warm}
            onFocus={warm}
            onClick={isDesktop ? undefined : () => setOpen(true)}
        >
            <CopyPlus className="size-5!" />
        </Button>
    );

    const picker = user && (
        <CollectionPicker
            content_type={content_type}
            slug={slug}
            username={user.username}
        />
    );

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <Tooltip delay={0}>
                    <TooltipTrigger
                        render={<PopoverTrigger render={button} />}
                    />
                    <TooltipContent>{TITLE}</TooltipContent>
                </Tooltip>
                <PopoverContent
                    side="top"
                    sideOffset={12}
                    aria-label={TITLE}
                    className="w-88 overflow-hidden p-0"
                >
                    <AnimatedHeight className="p-4">{picker}</AnimatedHeight>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <>
            {button}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent
                    aria-label={TITLE}
                    className="max-h-[85dvh] overflow-hidden p-0 pb-[var(--safe-area-bottom)]"
                >
                    <AnimatedHeight className="p-4">{picker}</AnimatedHeight>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default AddToCollectionButton;
