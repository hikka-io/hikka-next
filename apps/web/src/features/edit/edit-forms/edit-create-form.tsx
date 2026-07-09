import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createEditMutation, type EditContentTypeEnum } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { invalidateEdits } from '@/utils/api/invalidate-content-state';
import { useRouter } from '@/utils/navigation';

import type { EditMainContent } from '../types';
import AutoButton from './components/auto-button';
import EditFormFields from './components/edit-form-fields';
import {
    getEditFormDefaults,
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
    isNativeTitleMissing,
} from './utils/edit-param-utils';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
    mode?: 'view' | 'edit';
    content: EditMainContent;
};

const EditForm: FC<Props> = ({
    slug,
    content_type,
    content,
    mode = 'edit',
}) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const params = getEditParams(content_type)!;
    const groups = getEditGroups(content_type)!;
    const paramSlugs = getEditParamSlugs(params);
    const nativeTitleMissing = isNativeTitleMissing(content_type, content);

    const onDismiss = (editId: number) => {
        form.reset();
        router.push(`/edit/${editId}`);
    };

    const mutationAddEdit = useMutation({
        ...createEditMutation(),
        onSuccess: (data) => {
            invalidateEdits(queryClient);
            onDismiss(data.edit_id);
        },
    });

    const form = useAppForm({
        defaultValues: getEditFormDefaults(content, false),
        onSubmit: async ({ value }) => {
            mutationAddEdit.mutate({
                path: {
                    content_type: content_type,
                    slug: slug,
                },
                body: {
                    after: {
                        ...getFilteredEditParams(paramSlugs, value),
                    },
                    auto: (value as any).auto || false,
                    description: (value as any).description,
                },
            });
        },
    });

    return (
        <form.AppForm>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="flex flex-col gap-6"
            >
                <EditFormFields
                    params={params}
                    groups={groups}
                    mode={mode}
                    nativeTitleMissing={nativeTitleMissing}
                />
                {mode === 'edit' && (
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={mutationAddEdit.isPending}
                            type="submit"
                            className="w-fit"
                        >
                            {mutationAddEdit.isPending && <Spinner />}
                            Створити
                        </Button>
                        <AutoButton />
                    </div>
                )}
            </form>
        </form.AppForm>
    );
};

export default EditForm;
