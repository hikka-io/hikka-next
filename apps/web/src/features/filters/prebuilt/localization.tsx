'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import FormSwitch, { FormSwitchProps } from '@/components/form/form-switch';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import CollapsibleFilter from '../components/collapsible-filter';
import useChangeParam from '../hooks/use-change-param';

interface Props {
    className?: string;
}

const Genre: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const lang = searchParams.get('only_translated');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter title="Локалізація" active={Boolean(lang)}>
            <div className="flex items-center justify-between gap-2">
                <Label
                    className="text-muted-foreground"
                    htmlFor="uk-translated"
                >
                    Перекладено українською
                </Label>
                <Switch
                    checked={Boolean(lang)}
                    onCheckedChange={() =>
                        handleChangeParam('only_translated', !Boolean(lang))
                    }
                    id="uk-translated"
                />
            </div>
        </CollapsibleFilter>
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
