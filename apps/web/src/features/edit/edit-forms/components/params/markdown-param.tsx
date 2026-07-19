import type { FC } from 'react';
import * as React from 'react';

import { useQuery } from '@tanstack/react-query';

import { getEditOptions } from '@hikka/api';

import { useFormContext } from '@/components/form/form-context';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import { DiffViewer } from '@/components/plate/editor/diff-viewer';
import { PlateMarkdownEditor } from '@/components/plate/editor/plate-editor';
import { FIELD_BASE } from '@/components/ui/field-base';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

type Props = {
    param: Hikka.EditParam;
    mode: 'view' | 'edit';
};

type ParamView = 'value' | 'diff';

const MarkdownParam: FC<Props> = ({ mode, param }) => {
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
    const afterValue = (edit?.after as Record<string, string> | undefined)?.[
        param.slug
    ];

    if (mode === 'view') {
        const hasDiff = Boolean(edit) && Boolean(beforeValue);
        const showDiff = hasDiff && view === 'diff';

        return (
            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Label>{param.title}</Label>
                    {hasDiff && (
                        <Tabs
                            value={view}
                            onValueChange={(value) =>
                                setView(value as ParamView)
                            }
                        >
                            <TabsList size="sm">
                                <TabsTrigger value="value">
                                    Значення
                                </TabsTrigger>
                                <TabsTrigger value="diff">Різниця</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
                </div>
                {showDiff ? (
                    <DiffViewer
                        current={afterValue ?? ''}
                        previous={beforeValue ?? ''}
                    />
                ) : (
                    <form.Field
                        name={param.slug}
                        children={(field: any) => (
                            <MDViewer
                                className={cn(FIELD_BASE, 'markdown p-4')}
                            >
                                {field.state.value as string}
                            </MDViewer>
                        )}
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
