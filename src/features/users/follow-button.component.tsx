'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';
import MaterialSymbolsPersonAddOutlineRounded from '~icons/material-symbols/person-add-outline-rounded';
import MaterialSymbolsPersonRemoveOutlineRounded from '~icons/material-symbols/person-remove-outline-rounded';

import { Button } from '@/components/ui/button';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import useFollow from '@/services/hooks/follow/use-follow';
import useFollowChecker from '@/services/hooks/follow/use-follow-checker';
import useUnfollow from '@/services/hooks/follow/use-unfollow';
import useUser from '@/services/hooks/user/use-user';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
    username?: string;
    iconOnly?: boolean;
}

const FollowButton: FC<Props> = ({ className, username, iconOnly }) => {
    const { openModal } = useModalContext();
    const params = useParams();

    const { user: loggedUser } = useSession();
    const { data: user } = useUser({
        username: username || String(params.username),
    });

    const { data: followChecker } = useFollowChecker(
        {
            username: username || String(params.username),
        },
        { enabled: loggedUser && loggedUser.username !== params.username },
    );

    const { mutate: mutateFollow, isPending: followLoading } = useFollow({
        username: username || String(params.username),
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useUnfollow({
        username: username || String(params.username),
    });

    const handleFollowAction = async (action: 'follow' | 'unfollow') => {
        switch (action) {
            case 'follow':
                mutateFollow();
                break;
            case 'unfollow':
                mutateUnfollow();
        }
    };

    if (!user || !loggedUser) {
        return null;
    }

    return loggedUser ? (
        loggedUser.username !== user.username && followChecker ? (
            followChecker.follow ? (
                <Button
                    disabled={unfollowLoading}
                    onClick={() => handleFollowAction('unfollow')}
                    variant="outline"
                    className={cn('w-fit', className)}
                >
                    {unfollowLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <MaterialSymbolsPersonRemoveOutlineRounded />
                    )}
                    {!iconOnly && 'Не стежити'}
                </Button>
            ) : (
                <Button
                    variant="secondary"
                    disabled={followLoading}
                    onClick={() => handleFollowAction('follow')}
                    className={cn('w-fit', className)}
                >
                    {followLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <MaterialSymbolsPersonAddOutlineRounded />
                    )}
                    {!iconOnly && 'Відстежувати'}
                </Button>
            )
        ) : null
    ) : (
        <Button
            onClick={() =>
                openModal({
                    content: <AuthModal type="login" />,
                    forceModal: true,
                    className: 'max-w-3xl p-0',
                })
            }
            className={cn('w-fit', className)}
        >
            <MaterialSymbolsPersonAddOutlineRounded />
            {!iconOnly && 'Відстежувати'}
        </Button>
    );
};

export default FollowButton;
