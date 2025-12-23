'use client';

import { CommentsContentType } from '@hikka/client';
import Link from 'next/link';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { getDeclensionWord } from '@/utils/i18n/declension';

import IconamoonCommentFill from './icons/iconamoon/IconamoonCommentFill';

const COMMENT_DECLENSIONS: [string, string, string] = [
    'коментар',
    'коментарі',
    'коментарів',
];

interface Props {
    comments_count?: number;
    content_type: CommentsContentType;
    slug: string;
}

const CommentsButton: FC<Props> = ({ comments_count, content_type, slug }) => {
    return (
        <Button variant="outline" asChild>
            <Link href={`/comments/${content_type}/${slug}`}>
                <IconamoonCommentFill className="size-4" />
                {comments_count || 0}{' '}
                {getDeclensionWord(comments_count || 0, COMMENT_DECLENSIONS)}
            </Link>
        </Button>
    );
};

export default CommentsButton;
