'use client';

import { SunSnow } from 'lucide-react';
import { FC } from 'react';

import {
    BadgeFilterField,
    BadgeFilterFieldProps,
} from '@/components/form/form-badge-filter';
import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';

import { SEASON } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
}

const Season: FC<Props> = () => {
    const { seasons = [], date_range_enabled } = useFilterSearch<{
        seasons?: string[];
        date_range_enabled?: boolean;
    }>();

    const handleChangeParam = useChangeParam();

    if (date_range_enabled) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <SunSnow className="size-4 shrink-0" />
                <Label>Сезон</Label>
            </div>
            <BadgeFilter
                properties={SEASON}
                selected={seasons}
                property="seasons"
                onParamChange={handleChangeParam}
            />
        </div>
    );
};

export const FormSeason: FC<Props & Partial<BadgeFilterFieldProps>> = (
    props,
) => {
    const form = useTypedAppFormContext({ defaultValues: {} as never });
    return (
        <form.AppField
            name={"seasons" as never}
            children={() => (
                <BadgeFilterField
                    {...props}
                    properties={SEASON}
                    property="seasons"
                    label="Сезон"
                />
            )}
        />
    );
};

export default Season;
