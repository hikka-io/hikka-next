'use client';

import Link from 'next/link';
import { FC } from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';

import { Button } from '@/components/ui/button';

import getDeclensionWord from '@/utils/get-declension-word';

const COMMENT_DECLENSIONS: [string, string, string] = [
    'коментар',
    'коментарі',
    'коментарів',
];

interface Props {
    comments_count?: number;
    content_type: API.ContentType;
    slug: string;
}

const CommentsButton: FC<Props> = ({ comments_count, content_type, slug }) => {
    return (
        <Button variant="outline" asChild>
            <Link href={`/comments/${content_type}/${slug}`}>
                <IconamoonCommentFill />
                {comments_count || 0}{' '}
                {getDeclensionWord(comments_count || 0, COMMENT_DECLENSIONS)}
            </Link>
        </Button>
    );
};

export default CommentsButton;
