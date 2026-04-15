'use client';

import { ContentTypeEnum } from '@hikka/client';
import { Play } from 'lucide-react';
import { FC } from 'react';

import {
    BadgeFilterField,
    BadgeFilterFieldProps,
} from '@/components/form/form-badge-filter';
import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';

import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
} from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

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
    const { types = [] } = useFilterSearch<{ types?: string[] }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <Play className="size-4 shrink-0" />
                <Label>Тип</Label>
            </div>
            <BadgeFilter
                properties={getMediaType(content_type)}
                selected={types}
                property="types"
                onParamChange={handleChangeParam}
            />
        </div>
    );
};

export const FormMediaType: FC<Props & Partial<BadgeFilterFieldProps>> = ({
    content_type,
    ...props
}) => {
    const form = useTypedAppFormContext({ defaultValues: {} as never });
    return (
        <form.AppField
            name={"types" as never}
            children={() => (
                <BadgeFilterField
                    {...props}
                    properties={getMediaType(content_type)}
                    property="types"
                    label="Тип"
                />
            )}
        />
    );
};

export default MediaType;
