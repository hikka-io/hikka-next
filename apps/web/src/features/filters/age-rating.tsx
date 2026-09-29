import type { FC } from 'react';

import { ShieldEllipsis } from 'lucide-react';

import {
    BadgeFilterField,
    type BadgeFilterFieldProps,
    useTypedAppFormContext,
} from '@/components/form';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';
import { AGE_RATING } from '@/utils/constants/common';
import { useRouteSearch } from '@/utils/navigation';
import type { AnimeFilterSearch } from '@/utils/search-schemas';

import { filterPresetFormOptions } from './presets/filter-preset-form';
import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const AgeRating: FC<Props> = () => {
    const { ratings = [] } =
        useRouteSearch<Pick<AnimeFilterSearch, 'ratings'>>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldEllipsis className="size-4 shrink-0" />
                <Label>Віковий рейтинг</Label>
            </div>
            <BadgeFilter
                properties={AGE_RATING}
                selected={ratings}
                property="ratings"
                onParamChange={handleChangeParam}
            />
        </div>
    );
};

export const FormAgeRating: FC<Props & Partial<BadgeFilterFieldProps>> = (
    props,
) => {
    const form = useTypedAppFormContext(filterPresetFormOptions);
    return (
        <form.AppField
            name="ratings"
            children={() => (
                <BadgeFilterField
                    {...props}
                    properties={AGE_RATING}
                    property="ratings"
                    label="Віковий рейтинг"
                />
            )}
        />
    );
};

export default AgeRating;
