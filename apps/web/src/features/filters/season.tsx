import type { FC } from 'react';

import { SunSnow } from 'lucide-react';

import {
    BadgeFilterField,
    type BadgeFilterFieldProps,
    useTypedAppFormContext,
} from '@/components/form';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';
import { SEASON } from '@/utils/constants/common';
import { useRouteSearch } from '@/utils/navigation';
import type { AnimeFilterSearch } from '@/utils/search-schemas';

import { filterPresetFormOptions } from './presets/filter-preset-form';
import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const Season: FC<Props> = () => {
    const { seasons = [], date_range_enabled } =
        useRouteSearch<
            Pick<AnimeFilterSearch, 'seasons' | 'date_range_enabled'>
        >();

    const handleChangeParam = useChangeParam();

    if (date_range_enabled) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
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
    const form = useTypedAppFormContext(filterPresetFormOptions);
    return (
        <form.AppField
            name="seasons"
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
