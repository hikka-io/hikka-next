import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { CONTENT_CONFIG } from '@/utils/constants/common';

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
    const query = CONTENT_CONFIG[content_type].useInfo(slug);

    return {
        list: query.data?.authors,
        fetchNextPage: undefined,
        hasNextPage: false,
        isFetchingNextPage: false,
        ref: undefined,
    };
};
