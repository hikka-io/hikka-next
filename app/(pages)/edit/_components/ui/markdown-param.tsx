'use client';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { useParams } from 'next/navigation';

import MDEditor from '@/components/markdown/editor/MD-editor';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Button } from '@/components/ui/button';
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

    if (mode === 'view') {
        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-4 items-center">
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
                    render={({ field: { value } }) => (
                        <MDViewer className="bg-secondary/30 border-secondary/60 border rounded-md p-4 markdown text-sm">
                            {value}
                        </MDViewer>
                    )}
                />
                {mode === 'view' &&
                    edit &&
                    edit.before![param.slug] &&
                    showDiff && (
                        <MDViewer className="bg-secondary/30 border-secondary/60 border rounded-md p-4 markdown text-sm opacity-50 hover:opacity-100">
                            {edit.before![param.slug]}
                        </MDViewer>
                    )}
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
                        markdown={value || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
            />
        </div>
    );
};

export default Component;
