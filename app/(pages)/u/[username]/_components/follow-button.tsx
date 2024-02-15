'use client';

import CilUserFollow from '~icons/cil/user-follow';
import CilUserUnfollow from '~icons/cil/user-unfollow';

import { useParams } from 'next/navigation';

import {
    useFollow,
    useFollowChecker,
    useUnfollow,
    useUser,
} from '@/app/(pages)/u/[username]/page.hooks';
import AuthModal from '@/components/modals/auth-modal/auth-modal';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils';
import { useLoggedUser } from '@/app/page.hooks';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const { openModal } = useModalContext();
    const params = useParams();
    const { secret } = useAuthContext();

    const { data: loggedUser } = useLoggedUser(String(secret));
    const { data: user } = useUser(String(params.username));

    const { data: followChecker } = useFollowChecker(
        String(params.username),
        String(secret),
        loggedUser && loggedUser.username !== params.username,
    );

    const { mutate: mutateFollow, isPending: followLoading } = useFollow(
        String(secret),
        String(params.username),
    );

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useUnfollow(
        String(secret),
        String(params.username),
    );

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
            onClick={() => openModal({ content: <AuthModal type="login" /> })}
            className={cn('w-fit', className)}
        >
            <CilUserFollow />
            Відстежувати
        </Button>
    );
};

export default Component;