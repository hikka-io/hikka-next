'use client';

import { Activity } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { BadgeFilter } from '@/components/badge-filter';
import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';

import { useChangeParam } from '@/features/filters';

import { RELEASE_STATUS } from '@/utils/constants/common';

interface Props {
    className?: string;
}

const ReleaseStatus: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const statuses = searchParams.getAll('statuses');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter
            defaultOpen
            title="Статус"
            icon={<Activity className="size-4" />}
            active={statuses.length > 0}
        >
            <BadgeFilter
                properties={RELEASE_STATUS}
                selected={statuses}
                property="statuses"
                onParamChange={handleChangeParam}
            />
        </CollapsibleFilter>
    );
};

export const FormReleaseStatus: FC<Props & Partial<FormBadgeFilterProps>> = (
    props,
) => {
    return (
        <FormBadgeFilter
            {...props}
            name="statuses"
            properties={RELEASE_STATUS}
            property="statuses"
            label="Статус"
        />
    );
};

export default ReleaseStatus;
