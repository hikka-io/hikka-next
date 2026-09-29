import { useQuery } from '@tanstack/react-query';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import { CONTENT_CONFIG } from './content-config';

type StaffProps = {
    content_type: MainContentTypeEnum;
    slug: string;
};

export const useStaff = ({ content_type, slug }: StaffProps) => {
    if (content_type === ContentTypeEnum.ANIME) {
        // biome-ignore lint/correctness/useHookAtTopLevel: content_type is stable for a content page's lifetime, so the hook dispatch is consistent across renders.
        return CONTENT_CONFIG.anime.useStaff(slug);
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: content_type is stable for a content page's lifetime, so the hook dispatch is consistent across renders.
    const query = useQuery(contentInfoOptions(content_type, slug));

    return {
        list: query.data?.authors,
        fetchNextPage: undefined,
        hasNextPage: false,
        isFetchingNextPage: false,
        ref: undefined,
    };
};
