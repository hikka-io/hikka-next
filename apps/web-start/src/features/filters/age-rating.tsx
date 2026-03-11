'use client';

import { ShieldEllipsis } from 'lucide-react';
import { FC } from 'react';

import { BadgeFilter } from '@/components/ui/badge-filter';
import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';
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

export const FormAgeRating: FC<Props & Partial<FormBadgeFilterProps>> = (
    props,
) => {
    return (
        <FormBadgeFilter
            {...props}
            name="ratings"
            properties={AGE_RATING}
            property="ratings"
            label="Віковий рейтинг"
        />
    );
};

export default AgeRating;
