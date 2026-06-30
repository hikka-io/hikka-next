import { type FC, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, UserMinus, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import {
    type FollowUserResponse,
    followMutation,
    unfollowMutation,
} from '@hikka/api';

import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/features/auth/hooks/use-session';
import { invalidateFollow } from '@/utils/api/invalidate-content-state';

type Props = {
    author: FollowUserResponse;
    shareUrl: string;
};

const FeedItemMenu: FC<Props> = ({ author, shareUrl }) => {
    const { user: loggedUser } = useSession();
    const queryClient = useQueryClient();

    const [isFollowed, setIsFollowed] = useState(author.is_followed);

    const { mutate: mutateFollow, isPending: followLoading } = useMutation({
        ...followMutation(),
        onSuccess: (_data, { path }) => {
            setIsFollowed(true);
            invalidateFollow(queryClient, path.username);
        },
    });

    const { mutate: mutateUnfollow, isPending: unfollowLoading } = useMutation({
        ...unfollowMutation(),
        onSuccess: (_data, { path }) => {
            setIsFollowed(false);
            invalidateFollow(queryClient, path.username);
        },
    });

    const canFollow =
        loggedUser &&
        author.username &&
        loggedUser.username !== author.username;

    const handleCopy = () => {
        const url = shareUrl.startsWith('http')
            ? shareUrl
            : `${window.location.origin}${shareUrl}`;
        navigator.clipboard
            .writeText(url)
            .then(() => toast.success('Посилання скопійовано'))
            .catch(() => toast.error('Не вдалося скопіювати посилання'));
    };

    const handleFollowToggle = () => {
        if (!author.username) return;
        if (isFollowed) {
            mutateUnfollow({ path: { username: author.username } });
        } else {
            mutateFollow({ path: { username: author.username } });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground"
                    aria-label="Більше"
                >
                    <MaterialSymbolsMoreHoriz />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={handleCopy}>
                    <Copy />
                    Скопіювати посилання
                </DropdownMenuItem>
                {canFollow && (
                    <DropdownMenuItem
                        onClick={handleFollowToggle}
                        disabled={followLoading || unfollowLoading}
                    >
                        {isFollowed ? <UserMinus /> : <UserPlus />}
                        {isFollowed ? 'Не стежити' : 'Відстежувати'}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FeedItemMenu;
