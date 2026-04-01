'use client';

import { Languages } from 'lucide-react';
import { FC } from 'react';

import FormSwitch, { FormSwitchProps } from '@/components/form/form-switch';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
}

const Genre: FC<Props> = () => {
    const { only_translated } = useFilterSearch<{
        only_translated?: boolean;
    }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="text-muted-foreground flex items-center gap-2">
                <Languages className="size-4 shrink-0" />
                <Label htmlFor="uk-translated">Перекладено українською</Label>
            </div>
            <Switch
                checked={Boolean(only_translated)}
                onCheckedChange={() =>
                    handleChangeParam(
                        'only_translated',
                        !Boolean(only_translated),
                    )
                }
                id="uk-translated"
            />
        </div>
    );
};

export const FormLocalization: FC<Props & Partial<FormSwitchProps>> = (
    props,
) => {
    return (
        <FormSwitch
            {...props}
            name="only_translated"
            label="Перекладено українською"
        />
    );
};

export default Genre;
