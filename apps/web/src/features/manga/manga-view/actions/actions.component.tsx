'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useMangaBySlug, useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import CommentsButton from '@/components/comments-button';
import ReadListButton from '@/components/readlist-button/readlist-button';

import ReadStats from './read-stats';

const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();
    const { data: manga } = useMangaBySlug({ slug: String(params.slug) });

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <ReadListButton
                    content_type={ContentTypeEnum.MANGA}
                    disabled={!user}
                    additional
                    slug={String(params.slug)}
                />
                <ReadStats />
                {manga && (
                    <CommentsButton
                        comments_count={manga.comments_count}
                        slug={manga?.slug}
                        content_type={ContentTypeEnum.MANGA}
                    />
                )}
            </div>
        </div>
    );
};

export default Actions;
