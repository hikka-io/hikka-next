import { useQuery } from '@tanstack/react-query';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { animeStaffOptions } from './queries';

type StaffProps = {
    content_type: MainContentTypeEnum;
    slug: string;
    enabled?: boolean;
};

export const useStaff = ({ content_type, slug, enabled }: StaffProps) => {
    if (content_type === ContentTypeEnum.ANIME) {
        // biome-ignore lint/correctness/useHookAtTopLevel: content_type is stable for a content page's lifetime, so the hook dispatch is consistent across renders.
        return useInfiniteList(animeStaffOptions(slug), { enabled });
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: content_type is stable for a content page's lifetime, so the hook dispatch is consistent across renders.
    const query = useQuery(contentInfoOptions(content_type, slug));

    return {
        list: query.data?.authors,
        isPending: query.isPending,
        fetchNextPage: undefined,
        hasNextPage: false,
        isFetchingNextPage: false,
        ref: undefined,
    };
};
