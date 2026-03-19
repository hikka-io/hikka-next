'use client';

import { useSession } from '@hikka/react';
import { useRouterState } from '@tanstack/react-router';

import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

import { USER_ROLE } from '@/utils/constants/common';
import { PROFILE_MENU } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

const ProfileMenu = () => {
    const { user: loggedUser } = useSession();
    const currentUrl = useRouterState({
        select: (s) => s.location.pathname + s.location.searchStr,
    });

    if (!loggedUser) {
        return null;
    }

    const logout = () => {
        window.location.href = `/api/auth/logout?callbackUrl=${encodeURIComponent(currentUrl)}`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="md"
                    className="relative size-10 rounded-md"
                >
                    <Avatar className="rounded-md">
                        <AvatarImage
                            src={loggedUser.avatar}
                            className="rounded-md"
                            alt="avatar"
                        />
                        <AvatarFallback className="rounded-md">
                            {loggedUser.username[0]}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 p-0">
                <div className="bg-secondary/20 m-2 flex items-center gap-2 rounded-md border p-2">
                    <Avatar className="size-10 rounded-md">
                        <AvatarImage src={loggedUser.avatar} alt="pfp" />
                    </Avatar>
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <Label className="truncate">
                            {loggedUser.username}
                        </Label>
                        <p className="text-muted-foreground truncate text-xs">
                            {USER_ROLE[loggedUser.role].label}
                        </p>
                    </div>
                </div>

                {PROFILE_MENU.map((group, index) => (
                    <DropdownMenuGroup
                        key={group.title_ua}
                        title={group.title_ua}
                        className="flex flex-col gap-1 p-2"
                    >
                        <DropdownMenuLabel className="flex h-8 items-center">
                            {group.title_ua}
                        </DropdownMenuLabel>
                        {group.items.map((item) => (
                            <DropdownMenuItem
                                key={item.slug}
                                className="p-2"
                                asChild
                            >
                                <Link
                                    {...item.linkProps}
                                    to={item.url
                                        .replace(
                                            '{username}',
                                            loggedUser.username,
                                        )
                                        .replace('{currentUrl}', currentUrl)}
                                    search={item.search}
                                >
                                    {item.icon && (
                                        <item.icon className="size-4" />
                                    )}
                                    {item.title_ua}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        {PROFILE_MENU.length === index + 1 && (
                            <DropdownMenuItem onClick={logout} className="p-2">
                                <MaterialSymbolsLogoutRounded className="text-destructive-foreground" />
                                Вийти
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
