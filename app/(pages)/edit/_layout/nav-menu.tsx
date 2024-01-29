'use client';

import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { EDIT_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';

const Component = () => {
    const isMobile = useIsMobile();
    const pathname = usePathname();

    const current = EDIT_NAV_ROUTES.find((r) => pathname == '/edit' + r.url) || EDIT_NAV_ROUTES[0];

    return (
        <div className="flex gap-2 place-items-center">
            {current && (
                <Link
                    href={'/edit' + current?.url}
                    className="text-sm hover:underline"
                >
                    {current.title_ua}
                </Link>
            )}

            {!isMobile && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 px-1">
                            <PhCaretUpDownThin />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                            {EDIT_NAV_ROUTES.map((r) =>
                                !r.internals ? (
                                    <DropdownMenuItem asChild key={r.slug}>
                                        <Link href={'/edit' + r.url}>
                                            <span>{r.title_ua}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuSub key={r.slug}>
                                        <DropdownMenuSubTrigger>
                                            <span>{r.title_ua}</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                {r.internals.map((sub) => (
                                                    <DropdownMenuItem
                                                        asChild
                                                        key={sub.slug}
                                                    >
                                                        <Link
                                                            href={
                                                                '/edit' +
                                                                r.url +
                                                                sub.url
                                                            }
                                                        >
                                                            <span>
                                                                {sub.title_ua}
                                                            </span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                ),
                            )}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default Component;