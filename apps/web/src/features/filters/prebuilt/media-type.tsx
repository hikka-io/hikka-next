'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';

import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
} from '@/utils/constants/common';

import BadgeFilter from '../components/badge-filter';
import CollapsibleFilter from '../components/collapsible-filter';
import useChangeParam from '../hooks/use-change-param';

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
}

const getMediaType = (content_type: ContentTypeEnum) => {
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
};

const MediaType: FC<Props> = ({ content_type }) => {
    const searchParams = useSearchParams()!;

    const types = searchParams.getAll('types');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter title="Тип" active={types.length > 0}>
            <BadgeFilter
                properties={getMediaType(content_type)}
                selected={types}
                property="types"
                onParamChange={handleChangeParam}
            />
        </CollapsibleFilter>
    );
};

export const FormMediaType: FC<Props & Partial<FormBadgeFilterProps>> = ({
    content_type,
    ...props
}) => {
    return (
        <FormBadgeFilter
            {...props}
            name="types"
            properties={getMediaType(content_type)}
            property="types"
            label="Тип"
        />
    );
};

export default MediaType;
