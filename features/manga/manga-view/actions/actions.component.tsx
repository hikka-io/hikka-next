'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import CommentsButton from '@/components/comments-button';
import ReadListButton from '@/components/readlist-button/readlist-button';

import useSession from '@/services/hooks/auth/use-session';
import useMangaInfo from '@/services/hooks/manga/use-manga-info';

import ReadStats from './read-stats';

const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();
    const { data: manga } = useMangaInfo({ slug: String(params.slug) });

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <ReadListButton
                    content_type="manga"
                    disabled={!user}
                    additional
                    slug={String(params.slug)}
                />
                <ReadStats />
                {manga && (
                    <CommentsButton
                        comments_count={manga.comments_count}
                        slug={manga?.slug}
                        content_type="manga"
                    />
                )}
            </div>
        </div>
    );
};

export default Actions;
