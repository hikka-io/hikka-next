'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import * as React from 'react';
import { FC } from 'react';
import MaterialSymbolsShieldRounded from '~icons/material-symbols/shield-rounded';

import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import follow from '@/services/api/follow/follow';
import unfollow from '@/services/api/follow/unfollow';

interface Props {
    user: API.User;
}

const FollowUserItem: FC<Props> = ({ user }) => {
    const queryClient = useQueryClient();

    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    const { mutate: mutateFollow } = useMutation({
        mutationKey: ['follow'],
        mutationFn: (username: string) =>
            follow({
                params: {
                    username: String(username),
                },
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });

    const { mutate: mutateUnfollow } = useMutation({
        mutationKey: ['unfollow'],
        mutationFn: (username: string) =>
            unfollow({
                params: {
                    username: String(username),
                },
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
            <div className="flex min-w-0 gap-3">
                <div className="relative">
                    <Link href={'/u/' + user.username}>
                        <Avatar className="size-12 rounded-md">
                            <AvatarImage
                                src={user.avatar}
                                className="rounded-md"
                                alt="avatar"
                            />
                            <AvatarFallback className="rounded-md">
                                <MaterialSymbolsShieldRounded className="flex-1 text-xl text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    {user.active && (
                        <div className="absolute -bottom-1 -right-1 size-3 rounded-md border-2 border-secondary bg-success" />
                    )}
                </div>
                <div className="flex min-w-0 flex-col justify-between">
                    <Link href={'/u/' + user.username} className="font-bold">
                        {user.username}
                    </Link>
                    <Small className="truncate text-muted-foreground">
                        {user.description}
                    </Small>
                </div>
            </div>
            {user.username !== loggedUser?.username &&
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
                            Не стежити
                        </Button>
                    )
                ) : null)}
        </div>
    );
};

export default FollowUserItem;
