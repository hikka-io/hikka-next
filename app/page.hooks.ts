import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';

import getCharacterInfo from '@/services/api/characters/getCharacterInfo';
import { useAuthContext } from '@/services/providers/auth-provider';

export const useLoggedUser = () => {
    const { secret } = useAuthContext();

    return useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: Boolean(secret),
    });
};

export const useAnimeInfo = (slug: string) => {
    return useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
        enabled: false,
    });
};

export const useCharacterInfo = (slug: string) => {
    return useQuery({
        queryKey: ['character', slug],
        queryFn: () => getCharacterInfo({ slug }),
    });
};