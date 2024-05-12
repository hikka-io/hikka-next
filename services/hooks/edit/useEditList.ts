import { useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import getEditList from '@/services/api/edit/getEditList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

const useEditList = ({
    page,
    staleTime,
}: {
    page: string;
    staleTime?: number;
}) => {
    const { titleLanguage } = useSettingsContext();
    const searchParams = useSearchParams()!;

    const content_type = searchParams.get('content_type');
    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'edit_id';
    const edit_status = searchParams.get('edit_status');
    const author = searchParams.get('author');
    const moderator = searchParams.get('moderator');

    return useQuery({
        queryKey: [
            'editList',
            { page, content_type, order, sort, edit_status, author, moderator },
        ],
        queryFn: () =>
            getEditList({
                page: Number(page),
                params: {
                    sort: [`${sort}:${order}`],
                    status: edit_status as API.EditStatus,
                    content_type: content_type as API.ContentType,
                    author,
                    moderator,
                },
            }),
        select: (data) => ({
            ...data,
            list: data.list.map((e) => ({
                ...e,
                content:
                    'title_ua' in e.content
                        ? convertAnime({
                              anime: e.content,
                              titleLanguage: titleLanguage!,
                          })
                        : e.content,
            })),
        }),
        staleTime,
    });
};

export default useEditList;
