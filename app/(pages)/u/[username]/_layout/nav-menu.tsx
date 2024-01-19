'use client';

import PhCaretUpDownThin from '~icons/ph/caret-up-down-thin';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

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
import { USER_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';

const Component = () => {
    const isMobile = useIsMobile();
    const params = useParams();
    const pathname = usePathname();

    const current = USER_NAV_ROUTES.find(
        (r) => pathname === '/u/' + params.username + r.url,
    );

    return (
        <div className="flex gap-2 place-items-center">
            {current && (
                <Link
                    href={'/u/' + params.username + current?.url}
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
                            {USER_NAV_ROUTES.map((r) => (
                                <DropdownMenuItem asChild key={r.slug}>
                                    <Link
                                        href={'/u/' + params.username + r.url}
                                    >
                                        <span>{r.title_ua}</span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default Component;