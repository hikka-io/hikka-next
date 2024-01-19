'use client';

import MaterialSymbolsLightGridViewRounded from '~icons/material-symbols-light/grid-view-rounded';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';
import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';

interface Props {
    className?: string;
}

const ROUTES = [
    {
        slug: 'anime',
        title_ua: 'Каталог',
        url: '/anime',
        icon: <MaterialSymbolsLightGridViewRounded />,
        visible: true,
    },
    {
        slug: 'edit',
        title_ua: 'Правки',
        url: '/edit',
        icon: <MaterialSymbolsEditRounded />,
        visible: true,
    },
    {
        slug: 'users',
        title_ua: 'Користувачі',
        url: '/u',
        icon: null,
        visible: false,
    },
    {
        slug: 'characters',
        title_ua: 'Персонажі',
        url: '/characters',
        icon: null,
        visible: false,
    },
];

const Component = ({ className }: Props) => {
    const pathname = usePathname();
    const parsedPathname = pathname.split('/');

    const current = ROUTES.find(
        (r) =>
            parsedPathname.length > 1 &&
            ('/' + parsedPathname[1]).includes(r.url),
    );

    return (
        <div className="flex gap-2 place-items-center">
            {current && (
                <Link href={current.url} className="text-sm hover:underline">
                    {current.title_ua}
                </Link>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 px-1">
                        <PhCaretUpDownThin />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Навігація</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {ROUTES.map(
                            (r) =>
                                r.visible && (
                                    <DropdownMenuItem asChild key={r.slug}>
                                        <Link href={r.url}>
                                            {r.icon && (
                                                <div className="mr-2 h-4 w-4">
                                                    {r.icon}
                                                </div>
                                            )}
                                            <span>{r.title_ua}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ),
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Component;