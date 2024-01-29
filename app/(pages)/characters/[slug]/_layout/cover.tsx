'use client';

import { useParams } from 'next/navigation';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import BaseCard from '@/app/_components/base-card';
import FavoriteButton from '@/app/_components/favorite-button';
import Image from '@/app/_components/ui/image';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';

const Component = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const character: Hikka.Character | undefined = queryClient.getQueryData(['character', params.slug])

    if (!character) {
        return null;
    }

    return (
        <div className="flex items-center px-16 md:px-48 lg:px-0">
            <BaseCard poster={character.image}>
            </BaseCard>
        </div>
    );
};

export default Component;
