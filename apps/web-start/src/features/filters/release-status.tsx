'use client';

import { Activity } from 'lucide-react';
import { FC } from 'react';

import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';

import { RELEASE_STATUS } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
}

const ReleaseStatus: FC<Props> = () => {
    const { statuses = [] } = useFilterSearch<{ statuses?: string[] }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <Activity className="size-4 shrink-0" />
                <Label>Статус</Label>
            </div>
            <BadgeFilter
                properties={RELEASE_STATUS}
                selected={statuses}
                property="statuses"
                onParamChange={handleChangeParam}
            />
        </div>
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
