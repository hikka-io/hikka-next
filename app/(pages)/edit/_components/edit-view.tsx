'use client';

import * as React from 'react';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';



import { useRouter } from 'next/navigation';



import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQueryClient } from '@tanstack/react-query';



import EditDescription from '@/app/(pages)/edit/_components/edit-description/edit-description';
import EditGroup from '@/app/(pages)/edit/_components/edit-group';
import AutoButton from '@/app/(pages)/edit/_components/ui/auto-button';
import { Button } from '@/components/ui/button';
import updateEdit from '@/services/api/edit/updateEdit';
import useAuth from '@/services/hooks/auth/useAuth';
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

interface EditProps {
    mode?: 'view' | 'edit';
    editId: string;
}

const Component = ({ editId, mode = 'view' }: EditProps) => {
    const queryClient = useQueryClient();
    const { data: edit } = useEdit({ editId: Number(editId) });
    const captchaRef = useRef<TurnstileInstance>();

    const { auth } = useAuth();
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

        await queryClient.refetchQueries({
            queryKey: ['edit', editId],
        });

        router.push('/edit/' + editId);
    };

    const onSaveSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                const res = await updateEdit({
                    auth: String(auth),
                    edit_id: edit!.edit_id,
                    after: {
                        ...getFilteredEditParams(paramSlugs, data),
                    },
                    description: data.description,
                    captcha: String(captchaRef.current.getResponse()),
                });

                onDismiss();
            } else {
                throw Error('No captcha found');
            }
        } catch (e) {
            return;
        }
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

                    <EditDescription mode={mode} />
                </div>
                {mode === 'edit' && (
                    <div className="flex w-full flex-col gap-4">
                        <Turnstile
                            ref={captchaRef}
                            siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                disabled={form.formState.isSubmitting}
                                onClick={form.handleSubmit(onSaveSubmit)}
                                type="submit"
                                className="w-fit"
                            >
                                {form.formState.isSubmitting && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                Оновити
                            </Button>
                            <AutoButton
                                onSaveSubmit={onSaveSubmit}
                                handleSubmit={form.handleSubmit}
                            />
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    );
};

export default Component;
