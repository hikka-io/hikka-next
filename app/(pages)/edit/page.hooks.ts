import { useQuery } from '@tanstack/react-query';

import { useAnimeInfo, useCharacterInfo } from '@/app/page.hooks';
import getEdit from '@/services/api/edit/getEdit';
import getEditList from '@/services/api/edit/getEditList';

export const useEditList = ({
    page,
    staleTime,
}: {
    page: string;
    staleTime?: number;
}) => {
    return useQuery({
        queryKey: ['editList', page],
        queryFn: () =>
            getEditList({
                page: Number(page),
            }),
        staleTime,
    });
};

export const useEdit = <T extends API.Edit>(
    editId: string,
    select?: (data: T) => T,
) => {
    return useQuery<T, Error>({
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: Number(editId) }),
        select: select,
    });
};

export const useContentData = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    switch (content_type) {
        case 'anime':
            return useAnimeInfo(slug);
        case 'character':
            return useCharacterInfo(slug);
    }
};
