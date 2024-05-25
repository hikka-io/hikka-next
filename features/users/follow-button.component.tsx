'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';
import CilUserFollow from '~icons/cil/user-follow';
import CilUserUnfollow from '~icons/cil/user-unfollow';

import { Button } from '@/components/ui/button';

import AuthModal from '@/features/modals/auth-modal/auth-modal';

import useSession from '@/services/hooks/auth/useSession';
import useFollow from '@/services/hooks/follow/useFollow';
import useFollowChecker from '@/services/hooks/follow/useFollowChecker';
import useUnfollow from '@/services/hooks/follow/useUnfollow';
import useUser from '@/services/hooks/user/useUser';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const FollowButton: FC<Props> = ({ className }) => {
    const { openModal } = useModalContext();
    const params = useParams();

    const { user: loggedUser } = useSession();
    const { data: user } = useUser({ username: String(params.username) });

    const { data: followChecker } = useFollowChecker(
        {
            username: String(params.username),
        },
        { enabled: loggedUser && loggedUser.username !== params.username },
    );

    const { mutate: mutateFollow, isPending: followLoading } = useFollow({
        username: String(params.username),
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useUnfollow({
        username: String(params.username),
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
                        <CilUserUnfollow />
                    )}
                    Не стежити
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
                        <CilUserFollow />
                    )}
                    Відстежувати
                </Button>
            )
        ) : null
    ) : (
        <Button
            onClick={() =>
                openModal({
                    content: <AuthModal type="login" />,
                    forceModal: true,
                })
            }
            className={cn('w-fit', className)}
        >
            <CilUserFollow />
            Відстежувати
        </Button>
    );
};

export default FollowButton;
