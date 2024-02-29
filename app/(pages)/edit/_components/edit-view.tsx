'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import EditGroup from '@/app/(pages)/edit/_components/edit-group';
import AutoButton from '@/app/(pages)/edit/_components/ui/auto-button';
import EditDescription from '@/app/(pages)/edit/_components/ui/edit-description';
import { useEdit } from '@/app/(pages)/edit/page.hooks';
import { Button } from '@/components/ui/button';
import updateEdit from '@/services/api/edit/updateEdit';
import { useAuthContext } from '@/services/providers/auth-provider';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from '@/utils/editParamUtils';


type FormValues = (Hikka.AnimeEditParams | Hikka.CharacterEditParams) & {
    description: string;
    auto?: boolean;
};

interface EditProps {
    content_type: API.ContentType;
    mode?: 'view' | 'edit';
    editId: number;
}

const Component = ({ content_type, editId, mode = 'view' }: EditProps) => {
    const captchaRef = useRef<TurnstileInstance>();

    const { secret } = useAuthContext();
    const router = useRouter();

    const { data: edit } = useEdit(String(editId))!;

    if (!edit) {
        return null;
    }

    const params = getEditParams(content_type, Object.keys(edit.after))!;

    const groups = getEditGroups(content_type)!;
    const paramSlugs = getEditParamSlugs(params);

    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
    } = useForm<FormValues>({
        values: {
            description: edit.description || '',
            ...edit.after,
            synonyms:
                edit.after?.synonyms?.map((v: string) => ({
                    value: v,
                })) || [],
            auto: false,
        },
    });

    const onDismiss = (editId: number) => {
        reset();
        router.push('/edit/' + editId);
    };

    const onSaveSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                const res = await updateEdit({
                    secret: String(secret),
                    edit_id: editId,
                    after: {
                        ...getFilteredEditParams(paramSlugs, data),
                    },
                    description: data.description,
                    captcha: String(captchaRef.current.getResponse()),
                });

                onDismiss(res.edit_id);
            } else {
                throw Error('No captcha found');
            }
        } catch (e) {
            return;
        }
    };

    return (
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
                        control={control}
                        mode={mode}
                    />
                ))}

                <EditDescription
                    control={control}
                    disabled={mode === 'view'}
                    setValue={mode === 'view' ? undefined : setValue}
                />
            </div>
            {mode === 'edit' && (
                <div className="flex w-full flex-col gap-4">
                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
                    <div className="flex gap-2 items-center">
                        <Button
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSaveSubmit)}
                            type="submit"
                            className="w-fit"
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Оновити
                        </Button>
                        <AutoButton
                            onSaveSubmit={onSaveSubmit}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}
        </form>
    );
};

export default Component;
