import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';
import BxBxsUpvote from '~icons/bx/bxs-upvote';

import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import MDViewer from '../markdown/viewer/MD-viewer';
import { Label } from '../ui/label';

interface Props {
    comment: API.GlobalComment;
    href: string;
}

const GlobalComment: FC<Props> = ({ comment, href }) => {
    return (
        <div
            className="flex w-full scroll-mt-20 flex-col gap-2"
            id={comment.reference}
        >
            <div className="flex w-full flex-col items-start gap-2">
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
                            <H5>{comment.author.username}</H5>
                        </Link>

                        <Small className="text-muted-foreground">
                            {formatDistance(
                                comment.created * 1000,
                                Date.now(),
                                { addSuffix: true },
                            )}
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

                <Link href={href} className="hover:underline">
                    <MDViewer className="line-clamp-2 text-sm">
                        {comment.text}
                    </MDViewer>
                </Link>
            </div>
        </div>
    );
};

export default GlobalComment;
