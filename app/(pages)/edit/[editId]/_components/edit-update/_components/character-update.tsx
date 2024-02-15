'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useParams, useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQueryClient } from '@tanstack/react-query';

import EditDescription from '@/app/(pages)/edit/_components/ui/edit-description';
import { useEdit } from '@/app/(pages)/edit/page.hooks';
import { Button } from '@/components/ui/button';
import updateEdit from '@/services/api/edit/updateEdit';
import { useAuthContext } from '@/services/providers/auth-provider';
import {
    CHARACTER_DESCRIPTION_PARAMS,
    CHARACTER_TITLE_PARAMS,
} from '@/utils/constants';

import InputParam from '../../../../_components/ui/input-param';


type FormValues = Hikka.CharacterEditParams & {
    description: string;
};

const Component = () => {
    const queryClient = useQueryClient();
    const captchaRef = useRef<TurnstileInstance>();
    const router = useRouter();
    const params = useParams();

    const { secret } = useAuthContext();

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
    } = useForm<FormValues>();

    const [editParams, setEditParams] = useState<
        (keyof Hikka.CharacterEditParams)[]
    >([]);

    const { data: edit } = useEdit<
        Hikka.Edit<Hikka.CharacterEditParams, Hikka.Character>
    >(String(params.editId));

    const getEditParams = (data: FormValues) => {
        return editParams.reduce(
            (obj, item) => ({
                ...obj,
                [item]: data[item],
            }),
            {},
        );
    };

    const onDismiss = () => {
        reset();
        queryClient.invalidateQueries({
            queryKey: ['edit', String(edit!.edit_id)],
        });
        router.push(`/edit/${edit?.edit_id}`);
    };

    const onSaveSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                await updateEdit({
                    secret: String(secret),
                    edit_id: Number(edit?.edit_id),
                    after: {
                        ...getEditParams(data),
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

    useEffect(() => {
        if (edit) {
            setEditParams(
                Object.keys(edit.after) as (keyof Hikka.CharacterEditParams)[],
            );
        }
    }, [edit]);

    if (!edit) {
        return null;
    }

    return (
        <div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-6">
                    <div className="flex w-full flex-col gap-6">
                        {(edit.after.name_ua ||
                            edit.after.name_en ||
                            edit.after.name_ja) && (
                            <InputParam
                                edit={edit}
                                title="Імʼя персонажа"
                                selected={editParams}
                                content={edit.after}
                                params={CHARACTER_TITLE_PARAMS}
                                mode="edit"
                                control={control}
                                register={register}
                            />
                        )}

                        {edit.after.description_ua && (
                            <InputParam
                                selected={editParams}
                                params={CHARACTER_DESCRIPTION_PARAMS}
                                title="Опис персонажа"
                                mode="edit"
                                editor="markdown"
                                edit={edit}
                                content={edit.after}
                                control={control}
                                register={register}
                            />
                        )}

                        <EditDescription
                            register={register}
                            setValue={setValue}
                            value={edit?.description || undefined}
                        />
                    </div>
                    <div className="flex w-full flex-col gap-4">
                        <Turnstile
                            ref={captchaRef}
                            siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                        />
                        <Button
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSaveSubmit)}
                            type="submit"
                            className="w-fit"
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Зберегти
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Component;
