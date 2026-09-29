import type { FC } from 'react';

import { Activity } from 'lucide-react';

import {
    BadgeFilterField,
    type BadgeFilterFieldProps,
    useTypedAppFormContext,
} from '@/components/form';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';
import { RELEASE_STATUS } from '@/utils/labels/enum-labels';
import { useRouteSearch } from '@/utils/navigation';
import type { ContentFilterSearch } from '@/utils/search-schemas';

import { filterPresetFormOptions } from './presets/filter-preset-form';
import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const ReleaseStatus: FC<Props> = () => {
    const { statuses = [] } =
        useRouteSearch<Pick<ContentFilterSearch, 'statuses'>>();

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

export const FormReleaseStatus: FC<Props & Partial<BadgeFilterFieldProps>> = (
    props,
) => {
    const form = useTypedAppFormContext(filterPresetFormOptions);
    return (
        <form.AppField
            name="statuses"
            children={() => (
                <BadgeFilterField
                    {...props}
                    properties={RELEASE_STATUS}
                    property="statuses"
                    label="Статус"
                />
            )}
        />
    );
};

export default ReleaseStatus;
