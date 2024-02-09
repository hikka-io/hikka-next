'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import addEdit from '@/services/api/edit/addEdit';
import {
    ANIME_SYNOPSIS_PARAMS,
    ANIME_TITLE_PARAMS,
} from '@/utils/constants';
import { useAuthContext } from '@/services/providers/auth-provider';

import InputParam from '../../../../_components/ui/input-param';
import ListParam from '../../../../_components/ui/list-param';
import { useAnimeInfo } from '@/app/page.hooks';


type FormValues = Hikka.AnimeEditParams & {
    description: string;
};

interface Props {
    slug: string;
}

const Component = ({ slug }: Props) => {
    const captchaRef = useRef<TurnstileInstance>();
    const [editParams, setEditParams] = useState<
        (keyof Hikka.AnimeEditParams)[]
    >([]);
    const { secret } = useAuthContext();
    const router = useRouter();

    const { data: anime } = useAnimeInfo(slug);

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormValues>();

    const [synonyms, setSynonyms] = useState<string[]>([]);

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
        router.push('/edit');
    };

    const onSaveSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                await addEdit({
                    secret: String(secret),
                    content_type: 'anime',
                    slug: slug,
                    after: {
                        ...getEditParams(data),
                        synonyms: synonyms,
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

    const switchParam = (param: keyof Hikka.AnimeEditParams) => {
        setEditParams((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param],
        );
    };

    useEffect(() => {
        if (anime) {
            setSynonyms(anime.synonyms);
        }
    }, [anime]);

    if (!anime) {
        return null;
    }

    return (
        <div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-6">
                    <InputParam<Hikka.AnimeEditParams>
                        title="Назва аніме"
                        selected={editParams}
                        params={ANIME_TITLE_PARAMS}
                        content={anime}
                        editor="input"
                        onSwitchParam={switchParam}
                        register={register}
                        control={control}
                        mode="edit"
                    />

                    <ListParam
                        title="Синоніми"
                        inputTitle="Новий синонім"
                        selected={synonyms}
                        setList={setSynonyms}
                        mode="edit"
                    />

                    <InputParam<Hikka.AnimeEditParams>
                        title="Опис аніме"
                        editor="markdown"
                        selected={editParams}
                        params={ANIME_SYNOPSIS_PARAMS}
                        content={anime}
                        onSwitchParam={switchParam}
                        register={register}
                        control={control}
                        mode="edit"
                    />

                    <div className="flex flex-col gap-4 w-full">
                        <Label className="flex justify-between">
                            <span>Опис правки</span>
                            <span className="text-muted-foreground">
                                Необов’язково
                            </span>
                        </Label>
                        <Textarea
                            placeholder="Введіть причину правки"
                            rows={3}
                            className="w-full disabled:text-secondary-foreground"
                            {...register('description')}
                        />
                    </div>
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
                        Створити
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Component;