'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import MaterialSymbolsShieldRounded from '~icons/material-symbols/shield-rounded';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQueryClient } from '@tanstack/react-query';

import BaseCard from '@/app/_components/base-card';
import Modal from '@/app/_components/modal';
import { Button } from '@/app/_components/ui/button';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';
import acceptEdit from '@/utils/api/edit/acceptEdit';
import addEdit from '@/utils/api/edit/addEdit';
import closeEdit from '@/utils/api/edit/closeEdit';
import denyEdit from '@/utils/api/edit/denyEdit';
import updateEdit from '@/utils/api/edit/updateEdit';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Textarea } from '@/app/_components/ui/textarea';


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

interface Props {
    edit?: Hikka.Edit;
    setEdit?: Dispatch<SetStateAction<Hikka.Edit | undefined>>;
}

const Component = ({ edit, setEdit }: Props) => {
    const captchaRef = useRef<TurnstileInstance>();
    const queryClient = useQueryClient();
    const titleRef = useRef<HTMLInputElement>(null);
    const synopsisRef = useRef<HTMLInputElement>(null);
    const { animeEdit, switchModal } = useModalContext();
    const [editParams, setEditParams] = useState<(keyof Hikka.EditParams)[]>(
        [],
    );
    const params = useParams();
    const { secret } = useAuthContext();

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    const isView =
        edit &&
        (loggedUser?.username !== edit.author?.username ||
            edit.status !== 'pending');

    const anime: AnimeInfoResponse | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);

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
        switchModal('animeEdit', true);
        reset();
        queryClient.invalidateQueries(['editList']);
        setEdit && setEdit(undefined);
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

    const onUpdateSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                await updateEdit({
                    secret: String(secret),
                    edit_id: Number(edit?.edit_id),
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

    const onAcceptSubmit = async () => {
        try {
            await acceptEdit({
                secret: String(secret),
                edit_id: Number(edit?.edit_id),
            });

            onDismiss();
        } catch (e) {
            return;
        }
    };

    const onCloseSubmit = async () => {
        try {
            await closeEdit({
                secret: String(secret),
                edit_id: Number(edit?.edit_id),
            });

            onDismiss();
        } catch (e) {
            return;
        }
    };

    const onDenySubmit = async () => {
        try {
            await denyEdit({
                secret: String(secret),
                edit_id: Number(edit?.edit_id),
            });

            onDismiss();
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

    useEffect(() => {
        if (edit) {
            setEditParams(
                Object.keys(edit.after) as (keyof Hikka.EditParams)[],
            );

            if (titleRef.current) {
                titleRef.current.checked = true;
            }

            if (synopsisRef.current) {
                synopsisRef.current.checked = true;
            }
        }
    }, [edit]);

    return (
        <Modal
            noEscape
            open={Boolean(animeEdit) && (isView ? true : Boolean(anime))}
            onDismiss={onDismiss}
            id="animeEditModal"
            boxClassName="p-0 lg:max-w-5xl"
            title="Редагувати контент"
        >
            {Boolean(animeEdit) && (isView ? true : Boolean(anime)) && (
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-6 px-8 py-8"
                >
                    {edit && (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                            <div className="flex w-full items-center gap-4">
                                <div className="w-12">
                                    <BaseCard
                                        containerClassName="!pt-[100%]"
                                        poster={
                                            edit.author ? (
                                                edit.author.avatar
                                            ) : (
                                                <MaterialSymbolsShieldRounded className="text-xl flex-1 text-neutral" />
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex flex-1 flex-col">
                                    {edit.author ? (
                                        <Link
                                            href={'/u/' + edit.author.username}
                                        >
                                            <h5>{edit.author.username}</h5>
                                        </Link>
                                    ) : (
                                        <h5 className="text-neutral">
                                            Системна правка
                                        </h5>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-4">
                                            <p className="label-text text-sm opacity-60">
                                                {format(
                                                    edit.created * 1000,
                                                    'd MMM yyyy kk:mm',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid auto-cols-fr grid-flow-col gap-2">
                                {(loggedUser?.role === 'moderator' ||
                                    loggedUser?.role === 'admin') &&
                                edit.status === 'pending' ? (
                                    <>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            disabled={isSubmitting}
                                            onClick={handleSubmit(
                                                onAcceptSubmit,
                                            )}
                                        >
                                            Прийняти
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={isSubmitting}
                                            onClick={handleSubmit(onDenySubmit)}
                                        >
                                            Відхилити
                                        </Button>
                                    </>
                                ) : null}
                                {loggedUser?.username ===
                                    edit.author?.username &&
                                    edit.status === 'pending' && (
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            disabled={isSubmitting}
                                            onClick={handleSubmit(
                                                onCloseSubmit,
                                            )}
                                        >
                                            Закрити
                                        </Button>
                                    )}
                            </div>
                        </div>
                    )}
                    <div className="flex w-full flex-col gap-2">
                        <div className="collapse collapse-arrow border border-secondary">
                            <input
                                ref={titleRef}
                                type="checkbox"
                                defaultChecked={Boolean(edit)}
                            />
                            <div className="collapse-title flex items-center gap-4">
                                <h5>Назва аніме</h5>
                            </div>
                            <div className="collapse-content flex flex-col gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {TITLE_PARAMS.map((param) => (
                                        <Button
                                            variant={
                                                editParams.includes(param.param)
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="badge"
                                            disabled={isView}
                                            key={param.param}
                                            onClick={() =>
                                                switchParam(param.param)
                                            }
                                        >
                                            {param.title}
                                        </Button>
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
                                            className="space-y-2 w-full"
                                        >
                                            <Label>
                                                {param.title}
                                            </Label>
                                            <Input
                                                disabled={isView}
                                                type="text"
                                                placeholder={param.placeholder}
                                                className="w-full disabled:text-secondary-foreground"
                                                {...register(param.param, {
                                                    value: edit
                                                        ? edit!.after[
                                                              param.param
                                                          ]
                                                        : (anime![
                                                              param.param
                                                          ] as string) ||
                                                          undefined,
                                                })}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="collapse-arrow collapse border border-secondary">
                            <input
                                ref={synopsisRef}
                                type="checkbox"
                                defaultChecked={Boolean(edit)}
                            />
                            <div className="collapse-title flex items-center gap-4">
                                <h5>Опис аніме</h5>
                            </div>
                            <div className="collapse-content flex flex-col gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {SYNOPSIS_PARAMS.map((param) => (
                                        <Button
                                            variant={
                                                editParams.includes(param.param)
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="badge"
                                            disabled={isView}
                                            key={param.param}
                                            onClick={() =>
                                                switchParam(param.param)
                                            }
                                        >
                                            {param.title}
                                        </Button>
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
                                            className="space-y-2 w-full"
                                        >
                                            <Label className="label">
                                                {param.title}
                                            </Label>
                                            <Textarea
                                                disabled={isView}
                                                placeholder={param.placeholder}
                                                rows={5}
                                                className="w-full disabled:text-secondary-foreground"
                                                {...register(param.param, {
                                                    value: edit
                                                        ? edit!.after[
                                                              param.param
                                                          ]
                                                        : (anime![
                                                              param.param
                                                          ] as string) ||
                                                          undefined,
                                                })}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="form-control w-full">
                            <Label>
                                <span className="label-text">Опис правки</span>
                                <span className="label-text">
                                    Необов’язково
                                </span>
                            </Label>
                            <Textarea
                                disabled={isView}
                                placeholder="Введіть причину правки"
                                rows={3}
                                className="w-full disabled:text-secondary-foreground"
                                {...register('description', {
                                    value: edit
                                        ? edit!.description
                                            ? edit.description
                                            : undefined
                                        : undefined,
                                })}
                            />
                        </div>
                    </div>
                    {!isView && (
                        <div className="flex w-full flex-col gap-4">
                            <Turnstile
                                ref={captchaRef}
                                siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                            />
                            <Button
                                disabled={isSubmitting}
                                onClick={
                                    loggedUser?.username ===
                                    edit?.author?.username
                                        ? handleSubmit(onUpdateSubmit)
                                        : handleSubmit(onSaveSubmit)
                                }
                                type="submit"
                            >
                                {isSubmitting && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                {loggedUser?.username === edit?.author?.username
                                    ? 'Оновити'
                                    : 'Зберегти'}
                            </Button>
                        </div>
                    )}
                </form>
            )}
        </Modal>
    );
};

export default Component;