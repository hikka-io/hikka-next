'use client';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useEdit from '@/services/hooks/edit/useEdit';


type EditParamGroup = {
    title: string;
    slug: string;
};

type EditParamType = 'input' | 'markdown' | 'list';

type EditParam = {
    group?: EditParamGroup;
    title: string;
    slug: string;
    placeholder?: string;
    type: EditParamType;
};

interface Props {
    param: EditParam;
    mode: 'view' | 'edit';
}

const Component = ({ mode, param }: Props) => {
    const { control } = useFormContext();
    const params = useParams();
    const [showDiff, setShowDiff] = React.useState(false);
    const { data: edit } = useEdit({
        editId: Number(params.editId),
        enabled: mode === 'view',
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

            <Controller
                control={control}
                name={param.slug}
                render={({ field: { onChange, onBlur, ref, value } }) => (
                    <Input
                        disabled={mode === 'view'}
                        type="text"
                        placeholder={param.placeholder}
                        className="w-full disabled:cursor-text disabled:opacity-100"
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
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

export default Component;
