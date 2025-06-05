'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';

import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
} from '@/utils/constants/common';

import BadgeFilter from '../badge-filter';
import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
}

const MediaType: FC<Props> = ({ content_type }) => {
    const searchParams = useSearchParams()!;

    const types = searchParams.getAll('types');

    const handleChangeParam = useChangeParam();

    const getMediaType = useCallback(() => {
        switch (content_type) {
            case ContentTypeEnum.ANIME:
                return ANIME_MEDIA_TYPE;
            case ContentTypeEnum.MANGA:
                return MANGA_MEDIA_TYPE;
            case ContentTypeEnum.NOVEL:
                return NOVEL_MEDIA_TYPE;
            default:
                return ANIME_MEDIA_TYPE;
        }
    }, [content_type]);

    return (
        <CollapsibleFilter title="Тип" active={types.length > 0}>
            <BadgeFilter
                properties={getMediaType()}
                selected={types}
                property="types"
                onParamChange={handleChangeParam}
            />
        </CollapsibleFilter>
    );
};

export default MediaType;
