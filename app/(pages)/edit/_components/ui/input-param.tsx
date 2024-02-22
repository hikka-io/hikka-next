'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    control: any;
    mode: 'view' | 'edit';
}

const Component = ({ mode, control, param }: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Label>{param.title}</Label>

            <Controller
                control={control}
                name={param.slug}
                render={({ field: { onChange, onBlur, ref, value } }) => (
                    <Input
                        disabled={mode === 'view'}
                        type="text"
                        placeholder={param.placeholder}
                        className="w-full disabled:opacity-100 disabled:cursor-text"
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                    />
                )}
            />
        </div>
    );
};

export default Component;
