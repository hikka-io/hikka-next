'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { AGE_RATING } from '@/utils/constants/common';

import BadgeFilter from '../badge-filter';
import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

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

export default AgeRating;
