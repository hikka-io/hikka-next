'use client';

import { SunSnow } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { BadgeFilter } from '@/components/badge-filter';
import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';

import { useChangeParam } from '@/features/filters';

import { SEASON } from '@/utils/constants/common';

interface Props {
    className?: string;
}

const Season: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const seasons = searchParams.getAll('seasons');
    const dateRangeEnabled = searchParams.get('date_range_enabled');

    const handleChangeParam = useChangeParam();

    if (dateRangeEnabled) {
        return null;
    }

    return (
        <CollapsibleFilter
            defaultOpen
            title="Сезон"
            icon={<SunSnow className="size-4" />}
            active={seasons.length > 0}
        >
            <BadgeFilter
                properties={SEASON}
                selected={seasons}
                property="seasons"
                onParamChange={handleChangeParam}
            />
        </CollapsibleFilter>
    );
};

export const FormSeason: FC<Props & Partial<FormBadgeFilterProps>> = (
    props,
) => {
    return (
        <FormBadgeFilter
            {...props}
            name="seasons"
            properties={SEASON}
            property="seasons"
            label="Сезон"
        />
    );
};

export default Season;
