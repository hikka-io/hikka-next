import { ContentTypeEnum } from '@hikka/client';

import { CONTENT_CONFIG } from '@/utils/constants/common';

interface StaffProps {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
    slug: string;
}

export const useStaff = ({ content_type, slug }: StaffProps) => {
    if (content_type === ContentTypeEnum.ANIME) {
        return CONTENT_CONFIG.anime.useStaff(slug);
    }

    let query = CONTENT_CONFIG[content_type].useInfo(slug);

    return {
        list: query.data?.authors,
        fetchNextPage: undefined,
        hasNextPage: false,
        isFetchingNextPage: false,
        ref: undefined,
    };
};
