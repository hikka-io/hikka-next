'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { ContentTypeEnum } from '@hikka/client';
import { useCreateVote, useSession } from '@hikka/react';
import { ArrowBigUp, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

interface Props {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType: ContentTypeEnum;
    slug: string;
    myScore: number;
}

const FeedItemFooter: FC<Props> = ({
    commentsCount,
    voteScore,
    commentsHref,
    contentType,
    slug,
    myScore,
}) => {
    const { user: loggedUser } = useSession();
    const router = useRouter();
    const mutation = useCreateVote();

    const currentScore = mutation.variables?.score
        ? mutation.variables.score
        : myScore;

    const handleVote = () => {
        if (!loggedUser) {
            router.push('/login');
            return;
        }

        const updated = currentScore === 1 ? 0 : 1;

        mutation.mutate({
            contentType,
            slug,
            score: updated,
        });
    };

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex gap-1">
                <Button
                    asChild={!!commentsHref}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground gap-1 font-normal"
                >
                    {commentsHref ? (
                        <Link href={commentsHref}>
                            <MessageCircle />
                            {commentsCount > 0 && commentsCount}
                        </Link>
                    ) : (
                        <>
                            <MessageCircle />
                            {commentsCount > 0 && commentsCount}
                        </>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        'gap-1 font-normal',
                        currentScore === 1
                            ? 'text-success-foreground'
                            : 'text-muted-foreground',
                    )}
                    onClick={handleVote}
                >
                    <ArrowBigUp
                        className={cn(
                            'size-5!',
                            currentScore === 1 && 'fill-success-foreground',
                        )}
                    />
                    {voteScore}
                </Button>
            </div>
        </div>
    );
};

export default FeedItemFooter;
