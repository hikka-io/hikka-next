'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import follow from '@/services/api/follow/follow';
import unfollow from '@/services/api/follow/unfollow';
import useSession from '@/services/hooks/auth/use-session';

interface Props {
    user: API.User;
}

const FollowUserItem: FC<Props> = ({ user }) => {
    const queryClient = useQueryClient();

    const { user: loggedUser } = useSession();

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
        <HorizontalCard
            className="w-full px-6 py-4"
            href={`/u/${user.username}`}
        >
            <HorizontalCardImage image={user.avatar} imageRatio={1} />
            <HorizontalCardContainer>
                <HorizontalCardTitle>{user.username}</HorizontalCardTitle>
                <HorizontalCardDescription>
                    {user.description}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            {user.username !== loggedUser?.username &&
                ('is_followed' in user ? (
                    !user.is_followed ? (
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={() => mutateFollow(user.username)}
                        >
                            Відстежувати
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => mutateUnfollow(user.username)}
                        >
                            Не стежити
                        </Button>
                    )
                ) : null)}
        </HorizontalCard>
    );
};

export default FollowUserItem;
