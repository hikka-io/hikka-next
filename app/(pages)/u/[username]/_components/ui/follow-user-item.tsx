'use client';

import * as React from 'react';
import MaterialSymbolsShieldRounded from '~icons/material-symbols/shield-rounded';

import Link from 'next/link';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';
import follow from '@/app/_utils/api/follow/follow';
import unfollow from '@/app/_utils/api/follow/unfollow';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';

interface Props {
    user: Hikka.User;
}

const Component = ({ user }: Props) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const { mutate: mutateFollow } = useMutation({
        mutationKey: ['follow', secret],
        mutationFn: (username: string) =>
            follow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const { mutate: mutateUnfollow } = useMutation({
        mutationKey: ['unfollow', secret],
        mutationFn: (username: string) =>
            unfollow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    return (
        <div
            key={user.reference}
            className="flex items-center justify-between gap-4 px-6 py-4"
        >
            <div className="flex gap-3 min-w-0">
                <div className="indicator">
                    {user.active && (
                        <span className="indicator-item indicator-bottom badge badge-success h-2 w-2 p-0"></span>
                    )}
                    <Link href={'/u/' + user.username}>
                        <Avatar className="rounded-md w-12 h-12">
                            <AvatarImage
                                src={user.avatar}
                                className="rounded-md"
                                alt="avatar"
                            />
                            <AvatarFallback className="rounded-md">
                                <MaterialSymbolsShieldRounded className="text-xl flex-1 text-neutral" />
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
                <div className="flex flex-col justify-between min-w-0">
                    <Link
                        href={'/u/' + user.username}
                        className="font-bold"
                    >
                        {user.username}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                        {user.description}
                    </p>
                </div>
            </div>
            {secret &&
                user.username !== loggedUser?.username &&
                ('is_followed' in user ? (
                    !user.is_followed ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => mutateFollow(user.username)}
                        >
                            Відстежувати
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => mutateUnfollow(user.username)}
                        >
                            Не Стежити
                        </Button>
                    )
                ) : null)}
        </div>
    );
};

export default Component;