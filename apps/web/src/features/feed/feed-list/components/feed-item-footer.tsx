import { ArrowBigUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

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
                    className="text-muted-foreground gap-1 font-normal"
                >
                    {commentsHref ? (
                        <Link href={commentsHref}>
                            <MessageCircle />
                            {commentsCount}
                        </Link>
                    ) : (
                        <>
                            <MessageCircle />
                            {commentsCount}
                        </>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground pointer-events-none gap-1 font-normal"
                >
                    <ArrowBigUp className="!size-5" />
                    {voteScore}
                </Button>
            </div>
        </div>
    );
};

export default FeedItemFooter;
