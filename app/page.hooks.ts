import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';

import getCharacterInfo from '@/services/api/characters/getCharacterInfo';

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