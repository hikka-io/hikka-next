'use client';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import AutoButton from '@/features/edit/edit-forms/auto-button';
import EditDescription from '@/features/edit/edit-forms/edit-description';
import EditGroup from '@/features/edit/edit-forms/edit-group';

import updateEdit from '@/services/api/edit/updateEdit';
import useEdit, { key as editKey } from '@/services/hooks/edit/use-edit';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from '@/utils/edit-param-utils';

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
    const { data: edit } = useEdit({ edit_id: Number(editId) });
    const captchaRef = useRef<TurnstileInstance>();

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
            queryKey: editKey({ edit_id: Number(editId) }),
        });

        router.push('/edit/' + editId);
    };

    const mutation = useMutation({
        mutationFn: updateEdit,
        onSuccess: onDismiss,
    });

    const onSubmit = async (data: FormValues) => {
        mutation.mutate({
            params: {
                edit_id: edit!.edit_id,
                after: {
                    ...getFilteredEditParams(paramSlugs, data),
                },
                description: data.description,

                auto: data.auto || false,
            },
            captcha: String(captchaRef.current?.getResponse()),
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
                                    disabled={mutation.isPending}
                                    onClick={form.handleSubmit(onSubmit)}
                                    type="submit"
                                    className="w-fit"
                                >
                                    {mutation.isPending && (
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
