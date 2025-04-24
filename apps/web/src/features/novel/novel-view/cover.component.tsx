'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useNovelInfo, useSession } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import EditButton from '@/components/edit-button';
import FavoriteButton from '@/components/favorite-button';

const Cover: FC = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();
    const { data: novel } = useNovelInfo({ slug: String(params.slug) });

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard imageProps={{ priority: true }} image={novel?.image}>
                <div className="absolute bottom-2 right-2 z-[1] flex gap-2">
                    {loggedUser && (
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type={ContentTypeEnum.NOVEL}
                        />
                    )}
                    <FavoriteButton
                        slug={String(params.slug)}
                        content_type={ContentTypeEnum.NOVEL}
                    />
                </div>

                <div className="from-background absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t to-transparent" />
            </ContentCard>
        </div>
    );
};

export default Cover;
