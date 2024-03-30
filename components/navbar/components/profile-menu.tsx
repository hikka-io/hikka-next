'use client';

import React, { useState } from 'react';
import MaterialSymbolsEventList from '~icons/material-symbols/event-list';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded';
import MaterialSymbolsPerson from '~icons/material-symbols/person';
import MaterialSymbolsSettingsOutline from '~icons/material-symbols/settings-outline';



import Link from 'next/link';



import SettingsModal from '@/components/modals/user-settings-modal/user-settings-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import useAuth from '@/services/hooks/auth/useAuth';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import { useModalContext } from '@/services/providers/modal-provider';


interface Props {}

const Component = ({}: Props) => {
    const { openModal } = useModalContext();
    const { logout } = useAuth();

    const { data: loggedUser } = useLoggedUser();

    if (!loggedUser) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
            >
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
                        <Link href={'/u/' + loggedUser.username + '/list'}>
                            <MaterialSymbolsEventList className="mr-2 size-4" />
                            Список аніме
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/u/' + loggedUser.username + '/favorites'}>
                            <MaterialSymbolsFavoriteRounded className="mr-2 size-4" />
                            Улюблене
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            openModal({
                                content: <SettingsModal />,
                                type: 'sheet',
                                className: '!max-w-3xl flex flex-col gap-0 p-0',
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

export default Component;
