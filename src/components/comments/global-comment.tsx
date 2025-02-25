import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import MaterialSymbolsArticle from '~icons/material-symbols/article';

import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import MDViewer from '../markdown/viewer/MD-viewer';
import { Label } from '../ui/label';

interface Props {
    comment: API.Comment;
    href: string;
}

const GlobalComment: FC<Props> = ({ comment, href }) => {
    return (
        <div className="flex size-full flex-col items-start gap-4">
            <div className="flex w-full gap-3">
                <Link href={`/u/${comment.author.username}`}>
                    <Avatar className="w-10 rounded-md">
                        <AvatarImage
                            className="rounded-md"
                            src={comment.author.avatar}
                            alt="avatar"
                        />
                        <AvatarFallback className="rounded-md">
                            {comment.author.username[0]}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                    <Link
                        href={`/u/${comment.author.username}`}
                        className="w-fit"
                    >
                        <H5 className="line-clamp-1 break-all">
                            {comment.author.username}
                        </H5>
                    </Link>

                    <Small className="text-muted-foreground">
                        {formatDistance(comment.created * 1000, Date.now(), {
                            addSuffix: true,
                        })}
                    </Small>
                </div>
                {comment.vote_score > 0 && (
                    <div className="flex flex-1 items-start justify-end">
                        <div className="flex items-center gap-1">
                            <BxBxsUpvote className="size-3 text-success" />
                            <Label className="leading-none text-success">
                                {comment.vote_score}
                            </Label>
                        </div>
                    </div>
                )}
            </div>

            <Link href={href} className="flex-1 hover:underline">
                <MDViewer className="line-clamp-2 text-sm" disableSpoiler>
                    {comment.text}
                </MDViewer>
            </Link>

            <Link
                href={`${CONTENT_TYPE_LINKS[comment.content_type]}/${comment.preview.slug}`}
                className="flex items-center gap-1 text-primary hover:underline"
            >
                <MaterialSymbolsArticle className="shrink-0 text-muted-foreground" />
                <Small className="line-clamp-1">
                    {comment.content_type === 'collection'
                        ? `Колекція ${comment.preview.title}`
                        : comment.content_type === 'edit'
                          ? `Правка #${comment.preview.slug}`
                          : comment.preview.title}
                </Small>
            </Link>
        </div>
    );
};

export default GlobalComment;
