import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/app/_utils/api/anime/getAnimeInfo';
import getLoggedUserInfo from '@/app/_utils/api/user/getLoggedUserInfo';

import getCharacterInfo from './_utils/api/characters/getCharacterInfo';

export const useLoggedUser = (secret: string) => {
    return useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
    });
};

export const useAnimeInfo = (slug: string) => {
    return useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
    });
};

export const useCharacterInfo = (slug: string) => {
    return useQuery({
        queryKey: ['character', slug],
        queryFn: () => getCharacterInfo({ slug }),
    });
};