import type { FC } from 'react';
import * as React from 'react';

import { useQuery } from '@tanstack/react-query';

import { getEditOptions } from '@hikka/api';

import { useFormContext } from '@/components/form/form-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useParams } from '@/utils/navigation';

type Props = {
    param: Hikka.EditParam;
    mode: 'view' | 'edit';
};

type ParamView = 'value' | 'diff';

const InputParam: FC<Props> = ({ mode, param }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;
    const params = useParams();
    const [view, setView] = React.useState<ParamView>('value');
    const { data: edit } = useQuery({
        ...getEditOptions({ path: { edit_id: Number(params.editId) } }),
        enabled: mode === 'view',
    });

    const beforeValue = (edit?.before as Record<string, string> | null)?.[
        param.slug
    ];

    const hasDiff = mode === 'view' && Boolean(edit) && Boolean(beforeValue);
    const showDiff = hasDiff && view === 'diff';

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-4">
                <Label>{param.title}</Label>
                {hasDiff && (
                    <ToggleGroup
                        type="single"
                        size="badge"
                        value={view}
                        onValueChange={(value) =>
                            value && setView(value as ParamView)
                        }
                    >
                        <ToggleGroupItem value="value">
                            Значення
                        </ToggleGroupItem>
                        <ToggleGroupItem value="diff">Різниця</ToggleGroupItem>
                    </ToggleGroup>
                )}
            </div>

            {showDiff ? (
                <Input
                    className="w-full disabled:cursor-text hover:disabled:opacity-100"
                    value={beforeValue ?? ''}
                    disabled
                />
            ) : (
                <form.Field
                    name={param.slug}
                    children={(field: any) => (
                        <Input
                            disabled={mode === 'view'}
                            type="text"
                            placeholder={param.placeholder}
                            className="w-full disabled:cursor-text disabled:opacity-100"
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            value={field.state.value as string}
                        />
                    )}
                />
            )}
        </div>
    );
};

export default InputParam;
