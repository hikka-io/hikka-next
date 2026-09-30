import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    createEditMutation,
    type EditContentTypeEnum,
    EditStatusEnum,
} from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { invalidateEdits } from '@/utils/api/invalidate-content-state';
import { useRouter } from '@/utils/navigation';

import type { EditMainContent } from '../types';
import { useRefreshEditedContent } from '../use-refresh-edited-content';
import AutoButton from './components/auto-button';
import EditFormFields from './edit-form-fields';
import {
    getEditFormDefaults,
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
    isNativeTitleMissing,
} from './params/edit-param-utils';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
    mode?: 'view' | 'edit';
    content: EditMainContent;
};

const EditCreateForm: FC<Props> = ({
    slug,
    content_type,
    content,
    mode = 'edit',
}) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const refreshEditedContent = useRefreshEditedContent();

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
            if (data.status === EditStatusEnum.ACCEPTED) {
                refreshEditedContent(slug);
            }
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
            <form.Form className="flex flex-col gap-6">
                <EditFormFields
                    params={params}
                    groups={groups}
                    mode={mode}
                    nativeTitleMissing={nativeTitleMissing}
                    bleed
                />
                {mode === 'edit' && (
                    <div className="flex items-center gap-2">
                        <SubmitButton
                            loading={mutationAddEdit.isPending}
                            className="w-fit"
                        >
                            Створити
                        </SubmitButton>
                        <AutoButton />
                    </div>
                )}
            </form.Form>
        </form.AppForm>
    );
};

export default EditCreateForm;
