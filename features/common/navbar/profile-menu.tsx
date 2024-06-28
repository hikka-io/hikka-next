'use client';

import Link from 'next/link';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded';
import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsPerson from '~icons/material-symbols/person';
import MaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';

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

import SettingsModal from '@/features/modals/user-settings-modal/user-settings-modal';

import useSession from '@/services/hooks/auth/use-session';
import { useModalContext } from '@/services/providers/modal-provider';

const ProfileMenu = () => {
    const { openModal } = useModalContext();
    const { user: loggedUser, logout } = useSession();

    if (!loggedUser) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
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
                <div className="-m-1 flex items-center gap-2 bg-secondary/30 p-1">
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
                            <MaterialSymbolsPlayArrowRounded className="mr-2 size-4" />
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
                    <DropdownMenuItem
                        onClick={() => {
                            openModal({
                                content: <SettingsModal />,
                                type: 'sheet',
                                className: '!max-w-3xl flex flex-col gap-0 p-0',
                                forceModal: true,
                            });
                        }}
                    >
                        <MaterialSymbolsSettingsOutline className="mr-2 size-4" />
                        Налаштування
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                        <MaterialSymbolsLogoutRounded className="mr-2 size-4 text-destructive" />
                        Вийти
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
