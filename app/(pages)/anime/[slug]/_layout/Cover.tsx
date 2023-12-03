'use client';

import Image from '@/app/_components/Image';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import BaseCard from "@/app/_components/BaseCard";
import FavoriteButton from "@/app/_components/FavoriteButton";

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
        <div className="flex items-center lg:px-0 md:px-48 px-16">
            <BaseCard poster={data.poster}>
                <FavoriteButton slug={String(params.slug)} />
                <div className="absolute bg-gradient-to-t from-black to-transparent bottom-0 left-0 w-full h-24" />
            </BaseCard>
        </div>
    );
};

export default Component;
