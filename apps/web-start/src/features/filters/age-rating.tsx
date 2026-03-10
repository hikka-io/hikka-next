'use client';

import { ShieldEllipsis } from 'lucide-react';
import { useSearchParams } from '@/utils/navigation';
import { FC } from 'react';

import { BadgeFilter } from '@/components/ui/badge-filter';
import { CollapsibleFilter } from '@/components/ui/collapsible-filter';
import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';
import { Label } from '@/components/ui/label';

import { AGE_RATING } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';

interface Props {
    className?: string;
}

const AgeRating: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const ageRatings = searchParams.getAll('ratings');

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldEllipsis className="size-4 shrink-0" />
                <Label>Віковий рейтинг</Label>
            </div>
            <BadgeFilter
                properties={AGE_RATING}
                selected={ageRatings}
                property="ratings"
                onParamChange={handleChangeParam}
            />
        </div>
    );

    return (
        <CollapsibleFilter
            title="Віковий рейтинг"
            icon={<ShieldEllipsis className="size-4" />}
            active={ageRatings.length > 0}
        >
            <BadgeFilter
                properties={AGE_RATING}
                selected={ageRatings}
                property="ratings"
                onParamChange={handleChangeParam}
            />
        </CollapsibleFilter>
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
