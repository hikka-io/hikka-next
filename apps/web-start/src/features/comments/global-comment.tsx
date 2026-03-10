import { CommentResponse } from '@hikka/client';
import { formatDistance } from 'date-fns';
import { ArrowBigUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { StatItem } from '@/components/ui/stat-item';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import MDViewer from '@/components/markdown/viewer/MD-viewer';

interface Props {
    comment: CommentResponse;
    href: string;
}

const GlobalComment: FC<Props> = ({ comment, href }) => {
    return (
        <div className="flex size-full flex-col items-start gap-4">
            <HorizontalCard
                className="w-full gap-3"
            >
                <HorizontalCardImage
                    className="w-10"
                    image={comment.author.avatar}
                    imageRatio={1}
                    to={`/u/${comment.author.username}`}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle href={`/u/${comment.author.username}`}>
                        {comment.author.username}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {formatDistance(comment.created * 1000, Date.now(), {
                            addSuffix: true,
                        })}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
                {comment.vote_score > 0 && (
                    <div className="flex flex-1 justify-end self-start">
                        <StatItem size="sm" className="text-success-foreground">
                            <ArrowBigUp className="size-5! fill-success-foreground" />
                            {comment.vote_score}
                        </StatItem>
                    </div>
                )}
            </HorizontalCard>

            <Link to={href} className="w-full flex-1 hover:underline">
                <MDViewer className="line-clamp-2 break-words text-sm" preview>
                    {comment.text}
                </MDViewer>
            </Link>
            <div className="flex w-full  items-center gap-2">
                <Badge variant="secondary" className="shrink-0">
                    {CONTENT_TYPES[comment.content_type].title_ua}
                </Badge>
                <Link
                    to={`${CONTENT_TYPE_LINKS[comment.content_type]}/${comment.preview.slug}`}
                    className="text-primary-foreground flex items-center gap-1 hover:underline"
                >
                    <small className="line-clamp-1">
                        {comment.content_type === 'edit'
                            ? `#${comment.preview.slug}`
                            : comment.preview.title}
                    </small>
                </Link>
            </div>
        </div>
    );
};

export default GlobalComment;
