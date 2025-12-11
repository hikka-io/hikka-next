'use client';

import { UserResponse } from '@hikka/client';
import {
    useCreateFollow,
    useDeleteFollow,
    useSession,
    useUserByUsername,
} from '@hikka/react';
import { VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { FC } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';

import MaterialSymbolsPersonAddOutlineRounded from './icons/material-symbols/MaterialSymbolsPersonAddOutlineRounded';
import MaterialSymbolsPersonRemoveOutlineRounded from './icons/material-symbols/MaterialSymbolsPersonRemoveOutlineRounded';

interface Props {
    className?: string;
    username?: string;
    user?: UserResponse;
    iconOnly?: boolean;
    size?: VariantProps<typeof buttonVariants>['size'];
}

const FollowButton: FC<Props> = ({
    className,
    user: userProp,
    username,
    iconOnly,
    size,
}) => {
    const { openModal } = useModalContext();

    const { user: loggedUser } = useSession();

    const { data: userQuery } = useUserByUsername({
        username: username!,
        options: {
            enabled: username !== undefined,
        },
    });

    const user = userProp || userQuery;

    const { mutate: mutateFollow, isPending: followLoading } =
        useCreateFollow();

    const { mutate: mutateUnfollow, isPending: unfollowLoading } =
        useDeleteFollow();

    const handleFollowToggle = () => {
        if (user?.is_followed) {
            mutateUnfollow(user?.username!);
        } else {
            mutateFollow(user?.username!);
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
                <Link href="/login">
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
            variant={user.is_followed ? 'outline' : 'secondary'}
            disabled={followLoading || unfollowLoading}
            onClick={handleFollowToggle}
            className={cn(className)}
        >
            {followLoading || unfollowLoading ? (
                <span className="loading loading-spinner"></span>
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
