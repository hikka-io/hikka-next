'use client';

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
    content_type: API.ContentType;
}

const MediaType: FC<Props> = ({ content_type }) => {
    const searchParams = useSearchParams()!;

    const types = searchParams.getAll('types');

    const handleChangeParam = useChangeParam();

    const getMediaType = useCallback(() => {
        switch (content_type) {
            case 'anime':
                return ANIME_MEDIA_TYPE;
            case 'manga':
                return MANGA_MEDIA_TYPE;
            case 'novel':
                return NOVEL_MEDIA_TYPE;
            default:
                return ANIME_MEDIA_TYPE;
        }
    }, [content_type]);

    return (
        <CollapsibleFilter title="Тип">
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
