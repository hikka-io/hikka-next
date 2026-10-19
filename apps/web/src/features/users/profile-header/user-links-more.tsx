import { type FC, useState } from 'react';

import type { UserLinkResponse } from '@hikka/api';
import { getDeclensionWord, LINK_FORMS } from '@hikka/core';

import MaterialSymbolsOpenInNewRounded from '@/components/icons/material-symbols/MaterialSymbolsOpenInNewRounded';
import { buttonVariants } from '@/components/ui/button';
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
import UserLinkSummary from '@/components/user-link-summary';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { USER_LINK_REL } from '@/utils/user-links';

import UserLinksStack from './user-links-stack';

type Props = {
    links: UserLinkResponse[];
};

const LinkList: FC<Props> = ({ links }) => (
    <div className="flex flex-col">
        {links.map((link) => (
            <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel={USER_LINK_REL}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'group h-auto justify-start gap-3 p-2 text-left',
                )}
            >
                <UserLinkSummary link={link} />
                <MaterialSymbolsOpenInNewRounded className="text-muted-foreground opacity-0 group-hover:opacity-100" />
            </a>
        ))}
    </div>
);

const UserLinksMore: FC<Props> = ({ links }) => {
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);

    const trigger = (
        <UserLinksStack
            links={links}
            aria-label={`Ще ${links.length} ${getDeclensionWord(links.length, LINK_FORMS)}`}
        />
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
                <div className="-mx-4 -my-2 overflow-y-auto px-2">
                    <LinkList links={links} />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default UserLinksMore;
