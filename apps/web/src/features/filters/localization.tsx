import type { FC } from 'react';

import { Languages } from 'lucide-react';

import {
    SwitchField,
    type SwitchFieldProps,
    useTypedAppFormContext,
} from '@/components/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouteSearch } from '@/utils/navigation';
import type { ContentFilterSearch } from '@/utils/search-schemas';

import { filterPresetFormOptions } from './presets/filter-preset-form';
import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const Localization: FC<Props> = () => {
    const { only_translated } =
        useRouteSearch<Pick<ContentFilterSearch, 'only_translated'>>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Languages className="size-4 shrink-0" />
                <Label htmlFor="uk-translated">Перекладено українською</Label>
            </div>
            <Switch
                checked={Boolean(only_translated)}
                onCheckedChange={() =>
                    handleChangeParam('only_translated', !only_translated)
                }
                id="uk-translated"
            />
        </div>
    );
};

export const FormLocalization: FC<Props & Partial<SwitchFieldProps>> = (
    props,
) => {
    const form = useTypedAppFormContext(filterPresetFormOptions);
    return (
        <form.AppField
            name="only_translated"
            children={() => (
                <SwitchField {...props} label="Перекладено українською" />
            )}
        />
    );
};

export default Localization;
