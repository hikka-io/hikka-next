'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';

import { AGE_RATING } from '@/utils/constants/common';

import BadgeFilter from '../components/badge-filter';
import CollapsibleFilter from '../components/collapsible-filter';
import useChangeParam from '../hooks/use-change-param';

interface Props {
    className?: string;
}

const AgeRating: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const ageRatings = searchParams.getAll('ratings');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter
            title="Віковий рейтинг"
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
