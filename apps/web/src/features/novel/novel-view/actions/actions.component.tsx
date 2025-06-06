'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useNovelBySlug, useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import CommentsButton from '@/components/comments-button';
import ReadListButton from '@/components/readlist-button/readlist-button';

import ReadStats from './read-stats';

const Actions: FC = () => {
    const params = useParams();
    const { user } = useSession();
    const { data: novel } = useNovelBySlug({ slug: String(params.slug) });

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <ReadListButton
                    content_type={ContentTypeEnum.NOVEL}
                    disabled={!user}
                    additional
                    slug={String(params.slug)}
                />
                <ReadStats />
                {novel && (
                    <CommentsButton
                        comments_count={novel.comments_count}
                        slug={novel?.slug}
                        content_type={ContentTypeEnum.NOVEL}
                    />
                )}
            </div>
        </div>
    );
};

export default Actions;
