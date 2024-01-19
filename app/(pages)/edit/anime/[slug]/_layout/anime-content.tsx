'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import AnimeCard from '@/app/_components/anime-card';
import SubHeader from '@/app/_components/sub-header';
import { useSettingsContext } from '@/utils/providers/settings-provider';

const Component = () => {
    const { titleLanguage } = useSettingsContext();
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
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <AnimeCard
                    href={`/anime/` + params.slug}
                    poster={anime.poster}
                />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <AnimeCard
                        href={`/anime/` + params.slug}
                        poster={anime.poster}
                    />
                </div>
                <Link href={`/anime/` + params.slug}>
                    {anime[titleLanguage!] || anime.title_ua || anime.title_en || anime.title_ja}
                </Link>
            </div>
        </div>
    );
};

export default Component;
