import type { FC } from 'react';

import { Languages } from 'lucide-react';

import {
    SwitchField,
    type SwitchFieldProps,
} from '@/components/form/form-switch';
import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouteSearch } from '@/utils/navigation';

import useChangeParam from './hooks/use-change-param';

type Props = {
    className?: string;
};

const Localization: FC<Props> = () => {
    const { only_translated } = useRouteSearch<{
        only_translated?: boolean;
    }>();

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
    const form = useTypedAppFormContext({ defaultValues: {} as never });
    return (
        <form.AppField
            name={'only_translated' as never}
            children={() => (
                <SwitchField {...props} label="Перекладено українською" />
            )}
        />
    );
};

export default Localization;
