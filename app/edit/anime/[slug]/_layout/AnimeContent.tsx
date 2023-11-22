'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import * as React from 'react';
import BaseCard from '@/app/_components/BaseCard';
import { format } from 'date-fns';
import Link from 'next/link';
import SubHeader from "@/app/_components/SubHeader";
import AnimeCard from "@/app/_components/AnimeCard";

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
            <div className="w-full flex gap-4 items-center">
                <AnimeCard href={`/anime/` + params.slug} poster={anime.poster} />
            </div>
        </div>
    );
};

export default Component;
