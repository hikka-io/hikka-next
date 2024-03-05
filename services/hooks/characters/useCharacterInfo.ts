import { useQuery } from '@tanstack/react-query';

import getCharacterInfo from '@/services/api/characters/getCharacterInfo';

const useCharacterInfo = (slug: string) => {
    return useQuery({
        queryKey: ['character', slug],
        queryFn: () => getCharacterInfo({ slug }),
    });
};

export default useCharacterInfo;
