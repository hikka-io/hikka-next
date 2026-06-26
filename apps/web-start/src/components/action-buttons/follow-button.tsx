import type { FC } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { VariantProps } from 'class-variance-authority';

import {
    followMutation,
    unfollowMutation,
    type UserResponseFollowed,
    userProfileOptions,
    userProfileQueryKey,
} from '@hikka/api';
import { useSession } from '@/features/auth/hooks/use-session';

import MaterialSymbolsPersonAddOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddOutlineRounded';
import MaterialSymbolsPersonRemoveOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonRemoveOutlineRounded';
import { Button, type buttonVariants } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type Props = {
    className?: string;
    username?: string;
    user?: UserResponseFollowed;
    iconOnly?: boolean;
    size?: VariantProps<typeof buttonVariants>['size'];
};

const FollowButton: FC<Props> = ({
    className,
    user: userProp,
    username,
    iconOnly,
    size,
}) => {
    const { user: loggedUser } = useSession();
    const queryClient = useQueryClient();

    const { data: userQuery } = useQuery({
        ...userProfileOptions({ path: { username: username! } }),
        enabled: username !== undefined,
    });

    const user = userProp || userQuery;

    const updateFollowState = (is_followed: boolean) => {
        if (!user?.username) return;
        queryClient.setQueryData(
            userProfileQueryKey({ path: { username: user.username } }),
            (prev: UserResponseFollowed | undefined) =>
                prev ? { ...prev, is_followed } : prev,
        );
    };

    const invalidateFollow = (targetUsername: string) =>
        queryClient.invalidateQueries({
            predicate: (query) => {
                const id = (query.queryKey[0] as { _id?: string } | undefined)
                    ?._id;
                return (
                    id === 'followingList' ||
                    id === 'followersList' ||
                    id === 'followStats' ||
                    (id === 'userProfile' &&
                        JSON.stringify(query.queryKey).includes(
                            targetUsername,
                        ))
                );
            },
        });

    const { mutate: mutateFollow, isPending: followLoading } = useMutation({
        ...followMutation(),
        onSuccess: (_data, { path }) => {
            updateFollowState(true);
            invalidateFollow(path.username);
        },
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useMutation({
        ...unfollowMutation(),
        onSuccess: (_data, { path }) => {
            updateFollowState(false);
            invalidateFollow(path.username);
        },
    });

    const handleFollowToggle = () => {
        if (!user?.username) return;

        if (user.is_followed) {
            mutateUnfollow({ path: { username: user.username } });
        } else {
            mutateFollow({ path: { username: user.username } });
        }
    };

    if (!user) {
        return null;
    }

    if (!loggedUser) {
        return (
            <Button
                variant="outline"
                size={size}
                asChild
                className={cn(className)}
            >
                <Link to="/login">
                    <MaterialSymbolsPersonAddOutlineRounded />
                    {!iconOnly && 'Відстежувати'}
                </Link>
            </Button>
        );
    }

    if (loggedUser.username === user.username) {
        return null;
    }

    return (
        <Button
            size={size}
            variant={user.is_followed ? 'outline' : 'default'}
            disabled={followLoading || unfollowLoading}
            onClick={handleFollowToggle}
            className={cn(className)}
        >
            {followLoading || unfollowLoading ? (
                <Spinner />
            ) : user.is_followed ? (
                <MaterialSymbolsPersonRemoveOutlineRounded />
            ) : (
                <MaterialSymbolsPersonAddOutlineRounded />
            )}
            {!iconOnly && (user.is_followed ? 'Не стежити' : 'Відстежувати')}
        </Button>
    );
};

export default FollowButton;
