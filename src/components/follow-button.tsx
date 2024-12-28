'use client';

import { VariantProps } from 'class-variance-authority';
import { FC } from 'react';

import MaterialSymbolsPersonAddOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonAddOutlineRounded';
import MaterialSymbolsPersonRemoveOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPersonRemoveOutlineRounded';
import { Button, buttonVariants } from '@/components/ui/button';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import useFollow from '@/services/hooks/follow/use-follow';
import useUnfollow from '@/services/hooks/follow/use-unfollow';
import useUser from '@/services/hooks/user/use-user';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
    username?: string;
    user?: API.User;
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

    const { data: userQuery } = useUser(
        {
            username: username!,
        },
        {
            enabled: username !== undefined,
        },
    );

    const user = userProp || userQuery;

    const { mutate: mutateFollow, isPending: followLoading } = useFollow({
        username: user?.username!,
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useUnfollow({
        username: user?.username!,
    });

    const handleFollowToggle = () => {
        if (user?.is_followed) {
            mutateUnfollow();
        } else {
            mutateFollow();
        }
    };

    if (!username || !user) {
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
