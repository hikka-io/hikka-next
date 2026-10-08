import { useQuery } from '@tanstack/react-query';

import type {
    CommentContentTypeEnum,
    ContentTypeEnum,
    EditContentTypeEnum,
} from '@hikka/api';

import { useSessionUI } from '@/services/session';
import {
    type ContentInfo,
    type ContentInfoType,
    contentInfoOptions,
} from '@/utils/api/content-queries';
import { getContentTitle } from '@/utils/title/get-content-title';

type HeaderContentType =
    | CommentContentTypeEnum
    | EditContentTypeEnum
    | typeof ContentTypeEnum.USER;

type UseContentParams<T extends HeaderContentType> = {
    content_type: T;
    slug: string;
};

const CONTENT_IMAGE: {
    [T in ContentInfoType]: (data: ContentInfo<T>) => string | null;
} = {
    anime: (data) => data.image,
    manga: (data) => data.image,
    novel: (data) => data.image,
    character: (data) => data.image,
    person: (data) => data.image,
    collection: (data) => data.collection[0].content.image,
    edit: (data) => data.content.image,
    article: () => null,
    user: (data) => data.avatar,
};

const contentImage = <T extends ContentInfoType>(
    type: T,
    data: ContentInfo<T>,
) => CONTENT_IMAGE[type](data);

export function useContent<T extends HeaderContentType>({
    content_type,
    slug,
}: UseContentParams<T>) {
    const { preferences } = useSessionUI();

    return useQuery({
        ...contentInfoOptions(content_type, slug),
        select: (data) => ({
            content_type,
            title: getContentTitle(
                content_type,
                data,
                preferences.title_language,
                preferences.name_language,
            ),
            image: contentImage(content_type, data),
        }),
    });
}
