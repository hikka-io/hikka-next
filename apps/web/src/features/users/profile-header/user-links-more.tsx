import { type FC, useState } from 'react';

import type { UserLink } from '@hikka/api';

import MaterialSymbolsOpenInNewRounded from '@/components/icons/material-symbols/MaterialSymbolsOpenInNewRounded';
import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { getUserLinkDisplayUrl, getUserLinkLabel } from '@/utils/user-links';

const STACK_SIZE = 3;

type Props = {
    links: UserLink[];
    asPlaceholder?: boolean;
};

const LinkStack: FC<Props> = ({ links }) => (
    <>
        <span className="flex">
            {links.slice(0, STACK_SIZE).map((link, index) => {
                const Icon = USER_LINK_ICONS[link.icon];

                return (
                    <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: the stack is a fixed-order preview
                        key={index}
                        className="-ml-2 flex size-6 items-center justify-center rounded-full bg-secondary ring-2 ring-background first:ml-0 [&_svg]:size-3!"
                    >
                        <Icon />
                    </span>
                );
            })}
        </span>
        <span className="text-muted-foreground tabular-nums">
            +{links.length}
        </span>
    </>
);

const LinkList: FC<{ links: UserLink[] }> = ({ links }) => (
    <div className="flex flex-col">
        {links.map((link, index) => {
            const Icon = USER_LINK_ICONS[link.icon];

            return (
                <a
                    // biome-ignore lint/suspicious/noArrayIndexKey: links have no id and keep their order
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'group h-auto justify-start gap-3 whitespace-normal p-2 text-left',
                    )}
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                        <Icon />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                        <span className="break-words">
                            {getUserLinkLabel(link)}
                        </span>
                        <span className="truncate font-normal text-muted-foreground text-xs">
                            {getUserLinkDisplayUrl(link.url)}
                        </span>
                    </span>
                    <MaterialSymbolsOpenInNewRounded className="text-muted-foreground opacity-0 group-hover:opacity-100" />
                </a>
            );
        })}
    </div>
);

const UserLinksMore: FC<Props> = ({ links, asPlaceholder }) => {
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);
    const triggerClassName = 'gap-2 rounded-full pl-1 pr-3 backdrop-blur';

    if (asPlaceholder) {
        return (
            <span
                className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    triggerClassName,
                )}
            >
                <LinkStack links={links} />
            </span>
        );
    }

    const trigger = (
        <Button
            variant="outline"
            size="sm"
            className={triggerClassName}
            aria-label={`Ще ${links.length} посилань`}
        >
            <LinkStack links={links} />
        </Button>
    );

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger render={trigger} />
                <PopoverContent align="start" className="gap-0 p-1">
                    <LinkList links={links} />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger render={trigger} />
            <DrawerContent className="max-h-[85dvh]">
                <DrawerHeader>
                    <DrawerTitle>Посилання</DrawerTitle>
                </DrawerHeader>
                <div className="overflow-y-auto px-2 pb-4">
                    <LinkList links={links} />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default UserLinksMore;
