'use client';

import { UserResponse } from '@hikka/client';
import {
    useFollow,
    useSession,
    useUnfollow,
    useUserByUsername,
} from '@hikka/react';
import { VariantProps } from 'class-variance-authority';
import { FC } from 'react';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import MaterialSymbolsPersonAddOutlineRounded from './icons/material-symbols/MaterialSymbolsPersonAddOutlineRounded';
import MaterialSymbolsPersonRemoveOutlineRounded from './icons/material-symbols/MaterialSymbolsPersonRemoveOutlineRounded';
import { Button, buttonVariants } from './ui/button';

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

    const { mutate: mutateFollow, isPending: followLoading } = useFollow();

    const { mutate: mutateUnfollow, isPending: unfollowLoading } =
        useUnfollow();

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
                onClick={() =>
                    openModal({
                        content: <AuthModal type="login" />,
                        forceModal: true,
                        className: 'max-w-3xl p-0',
                    })
                }
                className={cn(className)}
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
