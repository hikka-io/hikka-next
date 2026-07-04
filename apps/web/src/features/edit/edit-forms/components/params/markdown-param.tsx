import type { FC } from 'react';
import * as React from 'react';

import { useQuery } from '@tanstack/react-query';

import { getEditOptions } from '@hikka/api';

import { useFormContext } from '@/components/form/form-context';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import { DiffViewer } from '@/components/plate/editor/diff-viewer';
import { PlateMarkdownEditor } from '@/components/plate/editor/plate-editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useParams } from '@/utils/navigation';

type Props = {
    param: Hikka.EditParam;
    mode: 'view' | 'edit';
};

const MarkdownParam: FC<Props> = ({ mode, param }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;
    const params = useParams();
    const [showDiff, setShowDiff] = React.useState(false);
    const { data: edit } = useQuery({
        ...getEditOptions({ path: { edit_id: Number(params.editId) } }),
        enabled: mode === 'view',
    });

    const beforeValue = (edit?.before as Record<string, string> | null)?.[
        param.slug
    ];
    const afterValue = (edit?.after as Record<string, string> | undefined)?.[
        param.slug
    ];

    if (mode === 'view') {
        return (
            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Label>{param.title}</Label>
                    {mode === 'view' && edit && beforeValue && (
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
                        <MDViewer className="markdown rounded-md border border-border surface-inset p-4 text-sm">
                            {field.state.value as string}
                        </MDViewer>
                    )}
                />
                {mode === 'view' && edit && beforeValue && showDiff && (
                    <DiffViewer
                        className="opacity-50 hover:opacity-100"
                        current={afterValue ?? ''}
                        previous={beforeValue}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <Label>{param.title}</Label>
            <form.Field
                name={param.slug}
                children={(field: any) => (
                    <PlateMarkdownEditor
                        placeholder={param.placeholder}
                        value={(field.state.value as string) || ''}
                        onValueChange={(val) => field.handleChange(val)}
                        modalTitle={param.title}
                        modalButtonTitle="Заповнити поле"
                        modalEditButtonTitle="Редагувати поле"
                    />
                )}
            />
        </div>
    );
};

export default MarkdownParam;
