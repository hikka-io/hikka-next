import type { FC } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getEditOptions, updateEditMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import {
    invalidateEditDetail,
    invalidateEdits,
} from '@/utils/api/invalidate-content-state';
import { useRouter } from '@/utils/navigation';

import AutoButton from './components/auto-button';
import EditFormFields from './components/edit-form-fields';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
    isNativeTitleMissing,
} from './utils/edit-param-utils';

type Props = {
    mode?: 'view' | 'edit' | 'update';
    editId: string;
};

const EditView: FC<Props> = ({ editId, mode = 'view' }) => {
    const { data: edit } = useQuery(
        getEditOptions({ path: { edit_id: Number(editId) } }),
    );

    const router = useRouter();
    const queryClient = useQueryClient();

    const params = getEditParams(edit!.content_type, Object.keys(edit!.after))!;

    const groups = getEditGroups(edit!.content_type)!;
    const paramSlugs = getEditParamSlugs(params);
    const nativeTitleMissing = isNativeTitleMissing(
        edit!.content_type,
        edit!.content,
    );

    const onDismiss = async () => {
        form.reset();

        router.push(`/edit/${editId}`);
    };

    const mutationUpdateEdit = useMutation({
        ...updateEditMutation(),
        onSuccess: () => {
            invalidateEditDetail(queryClient, Number(editId));
            invalidateEdits(queryClient);
            onDismiss();
        },
    });

    const form = useAppForm({
        defaultValues: {
            description: edit!.description || '',
            ...edit!.after,
            synonyms:
                (edit!.after?.synonyms as string[] | undefined)?.map((v) => ({
                    value: v,
                })) || [],
            auto: false,
        } as Record<string, unknown> & {
            description: string;
            auto: boolean;
        },
        onSubmit: async ({ value }) => {
            mutationUpdateEdit.mutate({
                path: { edit_id: edit!.edit_id },
                body: {
                    after: {
                        ...getFilteredEditParams(paramSlugs, value),
                    },
                    description: (value as any).description,

                    auto: (value as any).auto || false,
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
                {(mode === 'edit' || mode === 'update') && (
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                disabled={mutationUpdateEdit.isPending}
                                type="submit"
                                className="w-fit"
                            >
                                {mutationUpdateEdit.isPending && <Spinner />}
                                Оновити
                            </Button>
                            <AutoButton />
                        </div>
                    </div>
                )}
            </form>
        </form.AppForm>
    );
};

export default EditView;
