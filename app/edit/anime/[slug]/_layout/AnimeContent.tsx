'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import * as React from 'react';
import Link from 'next/link';
import SubHeader from '@/app/_components/SubHeader';
import AnimeCard from '@/app/_components/AnimeCard';

const Component = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const anime: Hikka.Anime | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);

    if (!anime) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Контент" variant="h4" />
            <div className="w-full gap-4 items-center lg:px-0 md:px-48 px-16 hidden lg:flex">
                <AnimeCard
                    href={`/anime/` + params.slug}
                    poster={anime.poster}
                />
            </div>
            <div className="w-full gap-4 flex lg:hidden">
                <div className="w-12">
                    <AnimeCard
                        href={`/anime/` + params.slug}
                        poster={anime.poster}
                    />
                </div>
                <Link href={`/anime/` + params.slug}>
                    {anime.title_ua || anime.title_en || anime.title_ja}
                </Link>
            </div>
        </div>
    );
};

export default Component;
