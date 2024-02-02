'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useParams, useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQuery } from '@tanstack/react-query';

import ListParam from '@/app/(pages)/edit/anime/[slug]/_components/edit-new/_components/ui/list-param';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Textarea } from '@/app/_components/ui/textarea';
import getAnimeInfo from '@/app/_utils/api/anime/getAnimeInfo';
import addEdit from '@/app/_utils/api/edit/addEdit';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';

import InputParam from './_components/ui/input-param';


type FormValues = Hikka.AnimeEditParams & {
    description: string;
};

const TITLE_PARAMS: Hikka.EditParam<Hikka.AnimeEditParams>[] = [
    {
        param: 'title_ua',
        title: 'Українською',
        placeholder: 'Введіть назву українською',
    },
    {
        param: 'title_en',
        title: 'Англійською',
        placeholder: 'Введіть назву англійською',
    },
    {
        param: 'title_ja',
        title: 'Японською',
        placeholder: 'Введіть назву японською',
    },
];

const SYNOPSIS_PARAMS: Hikka.EditParam<Hikka.AnimeEditParams>[] = [
    {
        param: 'synopsis_ua',
        title: 'Українською',
        placeholder: 'Введіть опис українською',
    },
    {
        param: 'synopsis_en',
        title: 'Англійською',
        placeholder: 'Введіть опис англійською',
    },
];

const Component = () => {
    const captchaRef = useRef<TurnstileInstance>();
    const [editParams, setEditParams] = useState<
        (keyof Hikka.AnimeEditParams)[]
    >([]);
    const params = useParams();
    const { secret } = useAuthContext();
    const router = useRouter();

    const { data: anime } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

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
                    contentType: 'anime',
                    slug: String(params.slug),
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
                        params={TITLE_PARAMS}
                        content={anime}
                        editor="input"
                        onSwitchParam={switchParam}
                        register={register}
                        control={control}
                    />

                    <ListParam
                        title="Синоніми"
                        inputTitle="Новий синонім"
                        selected={synonyms}
                        setList={setSynonyms}
                    />

                    <InputParam<Hikka.AnimeEditParams>
                        title="Опис аніме"
                        editor="markdown"
                        selected={editParams}
                        params={SYNOPSIS_PARAMS}
                        content={anime}
                        onSwitchParam={switchParam}
                        register={register}
                        control={control}
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