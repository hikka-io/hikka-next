import { CommentResponse } from '@hikka/client';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { Label } from '@/components/ui/label';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import { BxBxsUpvote } from '../icons/bx/BxBxsUpvote';
import MDViewer from '../markdown/viewer/MD-viewer';
import Small from '../typography/small';

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
                <HorizontalCardContainer className="gap-1">
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
                            <BxBxsUpvote className="text-success-foreground size-3" />
                            <Label className="text-success-foreground leading-none">
                                {comment.vote_score}
                            </Label>
                        </div>
                    </div>
                )}
            </HorizontalCard>

            <Link href={href} className="w-full flex-1 hover:underline">
                <MDViewer className="line-clamp-2 break-words text-sm" preview>
                    {comment.text}
                </MDViewer>
            </Link>
            <div className="flex w-full  items-center gap-2">
                <Badge variant="secondary" className="shrink-0">
                    {CONTENT_TYPES[comment.content_type].title_ua}
                </Badge>
                <Link
                    href={`${CONTENT_TYPE_LINKS[comment.content_type]}/${comment.preview.slug}`}
                    className="text-primary-foreground flex items-center gap-1 hover:underline"
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
