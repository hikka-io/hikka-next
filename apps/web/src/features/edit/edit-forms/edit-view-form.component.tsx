'use client';

import { queryKeys, useEdit, useUpdateEdit } from '@hikka/react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from '@/utils/edit-param-utils';

import AutoButton from './auto-button';
import EditDescription from './edit-description';
import EditGroup from './edit-group';

type FormValues = Record<string, unknown> & {
    description: string;
    auto?: boolean;
};

interface Props {
    mode?: 'view' | 'edit' | 'update';
    editId: string;
}

const EditView: FC<Props> = ({ editId, mode = 'view' }) => {
    const queryClient = useQueryClient();
    const { data: edit } = useEdit({ editId: Number(editId) });
    const captchaRef = useRef<TurnstileInstance>(null);

    const router = useRouter();

    const params = getEditParams(edit!.content_type, Object.keys(edit!.after))!;

    const groups = getEditGroups(edit!.content_type)!;
    const paramSlugs = getEditParamSlugs(params);

    const form = useForm<FormValues>({
        values: {
            description: edit!.description || '',
            ...edit!.after,
            synonyms:
                edit!.after?.synonyms?.map((v: string) => ({
                    value: v,
                })) || [],
            auto: false,
        },
    });

    const onDismiss = async () => {
        form.reset();

        await queryClient.invalidateQueries({
            queryKey: queryKeys.edit.byId(Number(editId)),
        });

        router.push('/edit/' + editId);
    };

    const mutationUpdateEdit = useUpdateEdit({
        options: {
            onSuccess: onDismiss,
        },
    });

    const onSubmit = async (data: FormValues) => {
        mutationUpdateEdit.mutate({
            editId: edit!.edit_id,
            edit: {
                after: {
                    ...getFilteredEditParams(paramSlugs, data),
                },
                description: data.description,

                auto: data.auto || false,
            },
        });
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-6">
                    {Object.keys(params).map((group) => (
                        <EditGroup
                            key={group}
                            title={groups[group]}
                            params={params[group]}
                            mode={mode}
                        />
                    ))}

                    <EditDescription mode={mode === 'update' ? 'edit' : mode} />
                </div>
                {mode === 'edit' ||
                    (mode === 'update' && (
                        <div className="flex w-full flex-col gap-4">
                            <Turnstile
                                ref={captchaRef}
                                siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    disabled={mutationUpdateEdit.isPending}
                                    onClick={form.handleSubmit(onSubmit)}
                                    type="submit"
                                    className="w-fit"
                                >
                                    {mutationUpdateEdit.isPending && (
                                        <span className="loading loading-spinner"></span>
                                    )}
                                    Оновити
                                </Button>
                                <AutoButton
                                    onSubmit={onSubmit}
                                    handleSubmit={form.handleSubmit}
                                />
                            </div>
                        </div>
                    ))}
            </form>
        </FormProvider>
    );
};

export default EditView;
