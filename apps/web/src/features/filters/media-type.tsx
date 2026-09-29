import type { FC } from 'react';

import { Play } from 'lucide-react';

import type { ContentTypeEnum } from '@hikka/api';

import {
    BadgeFilterField,
    type BadgeFilterFieldProps,
} from '@/components/form/form-badge-filter';
import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';
import { ANIME_MEDIA_TYPE, MEDIA_TYPE_BY_CONTENT_TYPE } from '@/utils/labels';
import { useRouteSearch } from '@/utils/navigation';

import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
    content_type: ContentTypeEnum;
};

const MediaType: FC<Props> = ({ content_type }) => {
    const { types = [] } = useRouteSearch<{ types?: string[] }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Play className="size-4 shrink-0" />
                <Label>Тип</Label>
            </div>
            <BadgeFilter
                properties={
                    MEDIA_TYPE_BY_CONTENT_TYPE[content_type] ?? ANIME_MEDIA_TYPE
                }
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
            name={'types' as never}
            children={() => (
                <BadgeFilterField
                    {...props}
                    properties={
                        MEDIA_TYPE_BY_CONTENT_TYPE[content_type] ??
                        ANIME_MEDIA_TYPE
                    }
                    property="types"
                    label="Тип"
                />
            )}
        />
    );
};

export default MediaType;
