'use client';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import BaseCard from '@/app/_components/base-card';
import FavoriteButton from '@/app/_components/favorite-button';
import Image from '@/app/_components/image';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';

const Component = () => {
    const params = useParams();

    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <BaseCard poster={data.poster}>
                <FavoriteButton slug={String(params.slug)} />
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
            </BaseCard>
        </div>
    );
};

export default Component;
