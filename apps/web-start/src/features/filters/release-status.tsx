'use client';

import { Activity } from 'lucide-react';
import { useSearchParams } from '@/utils/navigation';
import { FC } from 'react';

import { BadgeFilter } from '@/components/ui/badge-filter';
import FormBadgeFilter, {
    FormBadgeFilterProps,
} from '@/components/form/form-badge-filter';
import { Label } from '@/components/ui/label';

import { RELEASE_STATUS } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';

interface Props {
    className?: string;
}

const ReleaseStatus: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const statuses = searchParams.getAll('statuses');

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
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
