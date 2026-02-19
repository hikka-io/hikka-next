import Link from 'next/link';
import { FC } from 'react';

import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import { Button } from '@/components/ui/button';

interface Props {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
}

const FeedItemFooter: FC<Props> = ({
    commentsCount,
    voteScore,
    commentsHref,
}) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex gap-1">
                <Button
                    asChild={!!commentsHref}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground gap-1"
                >
                    {commentsHref ? (
                        <Link href={commentsHref}>
                            <IconamoonCommentFill className="size-3" />
                            {commentsCount}
                        </Link>
                    ) : (
                        <>
                            <IconamoonCommentFill className="size-3" />
                            {commentsCount}
                        </>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground pointer-events-none gap-1"
                >
                    <BxBxsUpvote className="size-3" />
                    {voteScore}
                </Button>
            </div>
        </div>
    );
};

export default FeedItemFooter;
