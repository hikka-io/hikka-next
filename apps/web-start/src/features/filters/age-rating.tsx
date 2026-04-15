'use client';

import { ShieldEllipsis } from 'lucide-react';
import { FC } from 'react';

import {
    BadgeFilterField,
    BadgeFilterFieldProps,
} from '@/components/form/form-badge-filter';
import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';

import { AGE_RATING } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
}

const AgeRating: FC<Props> = () => {
    const { ratings = [] } = useFilterSearch<{ ratings?: string[] }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
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
    const form = useTypedAppFormContext({ defaultValues: {} as never });
    return (
        <form.AppField
            name={"ratings" as never}
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
