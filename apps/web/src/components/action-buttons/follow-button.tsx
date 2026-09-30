import type { FC } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { VariantProps } from 'class-variance-authority';

import {
    followMutation,
    type UserResponseFollowed,
    unfollowMutation,
    userProfileOptions,
} from '@hikka/api';

import MaterialSymbolsPersonAddOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddOutlineRounded';
import MaterialSymbolsPersonRemoveOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonRemoveOutlineRounded';
import { Button, type buttonVariants } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { useSession } from '@/services/session';
import { invalidateFollow } from '@/utils/api/invalidate-content-state';
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

    const { mutate: mutateFollow, isPending: followLoading } = useMutation({
        ...followMutation(),
        onSuccess: (_data, { path }) => {
            invalidateFollow(queryClient, {
                username: path.username,
                is_followed: true,
            });
        },
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useMutation({
        ...unfollowMutation(),
        onSuccess: (_data, { path }) => {
            invalidateFollow(queryClient, {
                username: path.username,
                is_followed: false,
            });
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
                className={cn(className)}
                render={<Link to="/login" />}
            >
                <MaterialSymbolsPersonAddOutlineRounded />
                {!iconOnly && 'Відстежувати'}
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
