'use client';

import { useEdit } from '@hikka/react';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// import BasicEditor from '@/components/markdown/editor/basic-editor';
// import PlateDiff from '@/components/markdown/plate-editor/plate-diff';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { DiffViewer } from '@/components/plate/editor/diff-viewer';
import { CommentPlateEditor } from '@/components/plate/editor/plate-editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Props {
    param: Hikka.EditParam;
    mode: 'view' | 'edit';
}

const MarkdownParam: FC<Props> = ({ mode, param }) => {
    const { control } = useFormContext();
    const params = useParams();
    const [showDiff, setShowDiff] = React.useState(false);
    const { data: edit } = useEdit({
        editId: Number(params.editId),
        options: {
            enabled: mode === 'view',
        },
    });

    if (mode === 'view') {
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
                    render={({ field: { value } }) => (
                        <MDViewer className="markdown border-border bg-secondary/20 rounded-md border p-4 text-sm">
                            {value}
                        </MDViewer>
                    )}
                />
                {mode === 'view' &&
                    edit &&
                    edit.before![param.slug] &&
                    showDiff && (
                        <DiffViewer
                            className="opacity-50 hover:opacity-100"
                            current={edit.after![param.slug]}
                            previous={edit.before![param.slug]}
                        />
                    )}
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <Label>{param.title}</Label>
            <Controller
                control={control}
                name={param.slug}
                render={({ field: { onChange, value } }) => (
                    <CommentPlateEditor
                        placeholder={param.placeholder}
                        value={value || ''}
                        onValueChange={onChange}
                    />
                )}
            />
        </div>
    );
};

export default MarkdownParam;
