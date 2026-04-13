'use client';

import { useEdit } from '@hikka/react';
import * as React from 'react';
import { FC } from 'react';

import { useFormContext } from '@/components/form/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useParams } from '@/utils/navigation';

interface Props {
    param: Hikka.EditParam;
    mode: 'view' | 'edit';
}

const InputParam: FC<Props> = ({ mode, param }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;
    const params = useParams();
    const [showDiff, setShowDiff] = React.useState(false);
    const { data: edit } = useEdit({
        editId: Number(params.editId),
        options: {
            enabled: mode === 'view',
        },
    });

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-4">
                <Label>{param.title}</Label>
                {mode === 'view' && edit && edit.before![param.slug] && (
                    <Button
                        size="badge"
                        variant={showDiff ? 'secondary' : 'outline'}
                        onClick={() => setShowDiff(!showDiff)}
                    >
                        Різниця
                    </Button>
                )}
            </div>

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

            {mode === 'view' &&
                edit &&
                edit.before![param.slug] &&
                showDiff && (
                    <Input
                        className="w-full disabled:cursor-text hover:disabled:opacity-100"
                        value={edit.before![param.slug]}
                        disabled
                    />
                )}
        </div>
    );
};

export default InputParam;
