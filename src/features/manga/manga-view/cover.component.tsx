'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import FavoriteButton from '@/components/favorite-button';

import useMangaInfo from '@/services/hooks/manga/use-manga-info';

const Cover: FC = () => {
    const params = useParams();
    const { data: manga } = useMangaInfo({ slug: String(params.slug) });

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard imageProps={{ priority: true }} image={manga?.image}>
                <div className="absolute bottom-2 right-2 z-[1]">
                    <FavoriteButton
                        slug={String(params.slug)}
                        content_type="manga"
                    />
                </div>

                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
            </ContentCard>
        </div>
    );
};

export default Cover;
