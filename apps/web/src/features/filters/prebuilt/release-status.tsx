'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';

import { RELEASE_STATUS } from '@/utils/constants/common';

import BadgeFilter from '../badge-filter';
import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

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
