'use client';

import * as React from 'react';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import EditDescription from '@/app/(pages)/edit/components/edit-description/edit-description';
import EditGroup from '@/app/(pages)/edit/components/edit-group';
import AutoButton from '@/app/(pages)/edit/components/ui/auto-button';
import { Button } from '@/components/ui/button';
import updateEdit from '@/services/api/edit/updateEdit';
import useEdit from '@/services/hooks/edit/useEdit';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from '@/utils/editParamUtils';

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

    const mutation = useMutation({
        mutationFn: updateEdit,
        onSuccess: () => onDismiss,
    });

    const onDismiss = async () => {
        form.reset();

        await queryClient.refetchQueries({
            queryKey: ['edit', editId],
        });

        router.push('/edit/' + editId);
    };

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
