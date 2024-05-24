import { useQuery } from '@tanstack/react-query';

import getCharacterInfo, {
    Params,
} from '@/services/api/characters/getCharacterInfo';

const useCharacterInfo = ({ slug }: Params) => {
    return useQuery({
        queryKey: ['character', slug],
        queryFn: () => getCharacterInfo({ params: { slug } }),
    });
};

export default useCharacterInfo;
