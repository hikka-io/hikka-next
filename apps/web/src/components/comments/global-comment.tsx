import { CommentResponse } from '@hikka/client';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import { BxBxsUpvote } from '../icons/bx/BxBxsUpvote';
import MDViewer from '../markdown/viewer/MD-viewer';
import Small from '../typography/small';
import { Badge } from '../ui/badge';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '../ui/horizontal-card';
import { Label } from '../ui/label';

interface Props {
    comment: CommentResponse;
    href: string;
}

const GlobalComment: FC<Props> = ({ comment, href }) => {
    return (
        <div className="flex size-full flex-col items-start gap-4">
            <HorizontalCard
                className="w-full gap-3"
                href={`/u/${comment.author.username}`}
            >
                <HorizontalCardImage
                    className="w-10"
                    image={comment.author.avatar}
                    imageRatio={1}
                />
                <HorizontalCardContainer className="gap-0">
                    <HorizontalCardTitle>
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
                        <div className="flex items-center gap-1">
                            <BxBxsUpvote className="size-3 text-success" />
                            <Label className="leading-none text-success">
                                {comment.vote_score}
                            </Label>
                        </div>
                    </div>
                )}
            </HorizontalCard>

            <Link href={href} className="flex-1 hover:underline">
                <MDViewer className="line-clamp-2 text-sm" preview>
                    {comment.text}
                </MDViewer>
            </Link>
            <div className="flex gap-2  items-center w-full">
                <Badge variant="secondary" className="shrink-0">
                    {CONTENT_TYPES[comment.content_type].title_ua}
                </Badge>
                <Link
                    href={`${CONTENT_TYPE_LINKS[comment.content_type]}/${comment.preview.slug}`}
                    className="flex items-center gap-1 text-primary hover:underline"
                >
                    <Small className="line-clamp-1">
                        {comment.content_type === 'edit'
                            ? `#${comment.preview.slug}`
                            : comment.preview.title}
                    </Small>
                </Link>
            </div>
        </div>
    );
};

export default GlobalComment;
