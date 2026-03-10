'use client';

import { CommentsContentType } from '@hikka/client';
import { MessageCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { getDeclensionWord } from '@/utils/i18n/declension';

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
            <Link to={`/comments/${content_type}/${slug}`}>
                <MessageCircle className="size-4" />
                {comments_count || 0}{' '}
                {getDeclensionWord(comments_count || 0, COMMENT_DECLENSIONS)}
            </Link>
        </Button>
    );
};

export default CommentsButton;
