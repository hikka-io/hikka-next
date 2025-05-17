'use client';

import { useSession } from '@hikka/react';
import Link from 'next/link';

import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsFavoriteRounded from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import MaterialSymbolsLogoutRounded from '@/components/icons/material-symbols/MaterialSymbolsLogoutRounded';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

const ProfileMenu = () => {
    const { user: loggedUser } = useSession();

    if (!loggedUser) {
        return null;
    }

    const logout = async () => {
        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/logout`;
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
            <DropdownMenuContent align="end" className="w-56">
                <div className="bg-secondary/20 -m-1 flex items-center gap-2 p-1">
                    <Avatar className="size-9 rounded-md">
                        <AvatarImage src={loggedUser.avatar} alt="pfp" />
                    </Avatar>
                    <div className="flex flex-col">
                        <Label className="truncate">
                            {loggedUser.username}
                        </Label>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={'/u/' + loggedUser.username}>
                            <MaterialSymbolsPerson className="mr-2 size-4" />
                            Профіль
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/u/' + loggedUser.username + '/favorites'}>
                            <MaterialSymbolsFavoriteRounded className="mr-2 size-4" />
                            Улюблене
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            href={
                                '/u/' +
                                loggedUser.username +
                                '/list/anime?status=planned&sort=watch_score'
                            }
                        >
                            <MaterialSymbolsAnimatedImages className="mr-2 size-4" />
                            Список аніме
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={
                                '/u/' +
                                loggedUser.username +
                                '/list/manga?status=planned&sort=read_score'
                            }
                        >
                            <MaterialSymbolsPalette className="mr-2 size-4" />
                            Список манґи
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={
                                '/u/' +
                                loggedUser.username +
                                '/list/novel?status=planned&sort=read_score'
                            }
                        >
                            <MaterialSymbolsMenuBookRounded className="mr-2 size-4" />
                            Список ранобе
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={'/settings'}>
                            <MaterialSymbolsSettingsOutlineRounded className="mr-2 size-4" />
                            Налаштування
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                        <MaterialSymbolsLogoutRounded className="text-destructive mr-2 size-4" />
                        Вийти
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
