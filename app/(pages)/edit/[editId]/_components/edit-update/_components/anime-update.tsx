'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useParams, useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQueryClient } from '@tanstack/react-query';

import EditDescription from '@/app/(pages)/edit/[editId]/_components/ui/edit-description';
import { useEdit } from '@/app/(pages)/edit/page.hooks';
import { Button } from '@/components/ui/button';
import updateEdit from '@/services/api/edit/updateEdit';
import { useAuthContext } from '@/services/providers/auth-provider';
import { ANIME_SYNOPSIS_PARAMS, ANIME_TITLE_PARAMS } from '@/utils/constants';

import InputParam from '../../../../_components/ui/input-param';
import ListParam from '../../../../_components/ui/list-param';


type FormValues = Hikka.AnimeEditParams & {
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
        (keyof Hikka.AnimeEditParams)[]
    >([]);

    const [synonyms, setSynonyms] = useState<string[]>([]);

    const { data: edit } = useEdit<
        Hikka.Edit<Hikka.AnimeEditParams, Hikka.AnimeInfo>
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
                        ...(synonyms.length > 0 ? { synonyms: synonyms } : {}),
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
                Object.keys(edit.after) as (keyof Hikka.AnimeEditParams)[],
            );
        }
    }, [edit]);

    useEffect(() => {
        if (edit && edit.after.synonyms) {
            setSynonyms(edit.after.synonyms);
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
                        {(edit.after.title_ua ||
                            edit.after.title_en ||
                            edit.after.title_ja) && (
                            <InputParam
                                edit={edit}
                                title="Назва аніме"
                                selected={editParams}
                                params={ANIME_TITLE_PARAMS}
                                mode="edit"
                                content={edit.after}
                                register={register}
                                control={control}
                            />
                        )}

                        {edit.after.synonyms && (
                            <ListParam
                                title="Синоніми"
                                selected={synonyms}
                                setList={setSynonyms}
                                mode="edit"
                                inputTitle="Новий синонім"
                            />
                        )}

                        {(edit.after.synopsis_ua || edit.after.synopsis_en) && (
                            <InputParam
                                selected={editParams}
                                params={ANIME_SYNOPSIS_PARAMS}
                                title="Опис аніме"
                                mode="edit"
                                editor="markdown"
                                edit={edit}
                                content={edit.after}
                                register={register}
                                control={control}
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
