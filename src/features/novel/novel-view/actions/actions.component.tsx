'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import CommentsButton from '@/components/comments-button';
import ReadListButton from '@/components/readlist-button/readlist-button';

import useSession from '@/services/hooks/auth/use-session';
import useNovelInfo from '@/services/hooks/novel/use-novel-info';

import ReadStats from './read-stats';

const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();
    const { data: novel } = useNovelInfo({ slug: String(params.slug) });

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <ReadListButton
                    content_type="novel"
                    disabled={!user}
                    additional
                    slug={String(params.slug)}
                />
                <ReadStats />
                {novel && (
                    <CommentsButton
                        comments_count={novel.comments_count}
                        slug={novel?.slug}
                        content_type="novel"
                    />
                )}
            </div>
        </div>
    );
};

export default Actions;
