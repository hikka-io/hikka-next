'use client';

import clsx from 'clsx';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useParams } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import addEdit from '@/utils/api/edit/addEdit';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import useRouter from '@/utils/useRouter';

type FormValues = Hikka.EditParams & {
    description: string;
};

type Param = {
    param: keyof Hikka.EditParams;
    title: string;
    placeholder: string;
};

const TITLE_PARAMS: Param[] = [
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

const SYNOPSIS_PARAMS: Param[] = [
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
    const titleRef = useRef<HTMLInputElement>(null);
    const synopsisRef = useRef<HTMLInputElement>(null);
    const [editParams, setEditParams] = useState<(keyof Hikka.EditParams)[]>(
        [],
    );
    const params = useParams();
    const { secret } = useAuthContext();
    const router = useRouter();

    const { data: anime } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    const {
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormValues>();

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
                    after: getEditParams(data),
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

    const switchParam = (param: keyof Hikka.EditParams) => {
        setEditParams((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param],
        );
    };

    if (!anime) {
        return null;
    }

    return (
        <div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-2">
                    <div className="collapse-arrow collapse border border-secondary">
                        <input ref={titleRef} type="checkbox" />
                        <div className="collapse-title flex items-center gap-4">
                            <h5>Назва аніме</h5>
                        </div>
                        <div className="collapse-content flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                                {TITLE_PARAMS.map((param) => (
                                    <button
                                        key={param.param}
                                        onClick={() => switchParam(param.param)}
                                        className={clsx(
                                            'btn-badge btn btn-secondary rounded-badge',
                                            editParams.includes(param.param)
                                                ? 'btn-accent'
                                                : 'btn-outline',
                                        )}
                                    >
                                        {param.title}
                                    </button>
                                ))}
                            </div>
                            {editParams.map((eParam) => {
                                const param = TITLE_PARAMS.find(
                                    (tParam) => tParam.param === eParam,
                                );

                                if (!param) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={param.param}
                                        className="form-control w-full"
                                    >
                                        <label className="label">
                                            <span className="label-text">
                                                {param.title}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={param.placeholder}
                                            className="input w-full bg-secondary/60 disabled:bg-secondary/60 disabled:text-secondary-content"
                                            {...register(param.param, {
                                                value:
                                                    (anime![
                                                        param.param
                                                    ] as string) || undefined,
                                            })}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="collapse-arrow collapse border border-secondary">
                        <input ref={synopsisRef} type="checkbox" />
                        <div className="collapse-title flex items-center gap-4">
                            <h5>Опис аніме</h5>
                        </div>
                        <div className="collapse-content flex flex-col gap-2">
                            <div className="flex flex-wrap gap-2">
                                {SYNOPSIS_PARAMS.map((param) => (
                                    <button
                                        key={param.param}
                                        onClick={() => switchParam(param.param)}
                                        className={clsx(
                                            'btn-badge btn btn-secondary rounded-badge',
                                            editParams.includes(param.param)
                                                ? 'btn-accent'
                                                : 'btn-outline',
                                        )}
                                    >
                                        {param.title}
                                    </button>
                                ))}
                            </div>
                            {editParams.map((eParam) => {
                                const param = SYNOPSIS_PARAMS.find(
                                    (tParam) => tParam.param === eParam,
                                );

                                if (!param) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={param.param}
                                        className="form-control w-full"
                                    >
                                        <label className="label">
                                            <span className="label-text">
                                                {param.title}
                                            </span>
                                        </label>
                                        <textarea
                                            placeholder={param.placeholder}
                                            rows={5}
                                            className="textarea textarea-ghost w-full bg-secondary/60 text-base disabled:bg-secondary/60 disabled:text-secondary-content"
                                            {...register(param.param, {
                                                value:
                                                    (anime![
                                                        param.param
                                                    ] as string) || undefined,
                                            })}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Опис правки</span>
                            <span className="label-text-alt opacity-60">
                                Необов’язково
                            </span>
                        </label>
                        <textarea
                            placeholder="Введіть причину правки"
                            rows={3}
                            className="textarea textarea-ghost w-full bg-secondary/60 text-base disabled:bg-secondary/60 disabled:text-secondary-content"
                            {...register('description')}
                        />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-4">
                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
                    <button
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSaveSubmit)}
                        type="submit"
                        className="btn btn-accent w-fit"
                    >
                        {isSubmitting && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Створити
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Component;
