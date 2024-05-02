'use client';

import React from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import getDeclensionWord from '@/utils/getDeclensionWord';


const COMMENT_DECLENSIONS: [string, string, string] = [
    'коментар',
    'коментарі',
    'коментарів',
];

const CommentsButton = () => {
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    return (
        <Button variant="outline" asChild>
            <Link href={`/anime/${params.slug}/comments`}>
                <IconamoonCommentFill />
                {anime?.comments_count || 0}{' '}
                {getDeclensionWord(
                    anime?.comments_count || 0,
                    COMMENT_DECLENSIONS,
                )}
            </Link>
        </Button>
    );
};

export default CommentsButton;
