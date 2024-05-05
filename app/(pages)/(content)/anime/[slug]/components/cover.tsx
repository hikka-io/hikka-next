'use client';

import { FC } from 'react';

import { useParams } from 'next/navigation';

import ContentCard from '@/components/content-card/content-card';
import FavoriteButton from '@/components/favorite-button';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';


const Cover: FC = () => {
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard posterProps={{ priority: true }} poster={anime?.poster}>
                <div className="absolute bottom-2 right-2 z-[1]">
                    <FavoriteButton
                        slug={String(params.slug)}
                        content_type="anime"
                    />
                </div>

                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
            </ContentCard>
        </div>
    );
};

export default Cover;
