'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';

import MDEditor from '@/components/markdown/editor/MD-editor';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
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
    if (mode === 'view') {
        return (
            <div className="flex flex-col gap-4 w-full">
                <Label>{param.title}</Label>
                <Controller
                    control={control}
                    name={param.slug}
                    render={({ field: { value } }) => (
                        <MDViewer className="bg-secondary/30 border-secondary/60 border rounded-md p-4 markdown text-sm">
                            {value}
                        </MDViewer>
                    )}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <Label>{param.title}</Label>
            <Controller
                control={control}
                name={param.slug}
                render={({ field: { onChange, onBlur, ref, value } }) => (
                    <MDEditor
                        ref={ref}
                        placeholder={param.placeholder}
                        className="dark-theme dark-editor bg-secondary/30 border-secondary/60 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        markdown={value || ""}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
            />
        </div>
    );
};

export default Component;
