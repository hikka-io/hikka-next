import getCharacterVoices, {
    Params,
} from '@/services/api/characters/getCharacterVoices';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

const usePersonCharacters = ({ slug }: Params) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['characterVoices', slug],
        queryFn: ({ pageParam = 1 }) =>
            getCharacterVoices({
                params: {
                    slug,
                },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    anime: convertTitle<API.AnimeInfo>({
                        data: ch.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export default usePersonCharacters;
