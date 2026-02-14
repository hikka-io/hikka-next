'use client';

import { SunSnow } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { BadgeFilter } from '@/components/badge-filter';
import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';
import { Label } from '@/components/ui/label';

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
