'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import EditDescription from '@/app/(pages)/edit/_components/ui/edit-description';
import { useCharacterInfo } from '@/app/page.hooks';
import { Button } from '@/components/ui/button';
import addEdit from '@/services/api/edit/addEdit';
import { useAuthContext } from '@/services/providers/auth-provider';
import {
    CHARACTER_DESCRIPTION_PARAMS,
    CHARACTER_TITLE_PARAMS,
} from '@/utils/constants';

import InputParam from '../../../../_components/ui/input-param';
import AutoButton from '@/app/(pages)/edit/_components/ui/auto-button';


type FormValues = Hikka.CharacterEditParams & {
    description: string;
    auto?: boolean;
};

interface Props {
    slug: string;
}

const Component = ({ slug }: Props) => {
    const captchaRef = useRef<TurnstileInstance>();
    const [editParams, setEditParams] = useState<
        (keyof Hikka.CharacterEditParams)[]
    >([]);
    const { secret } = useAuthContext();
    const router = useRouter();

    const { data: character } = useCharacterInfo(slug);

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
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

    const onDismiss = (editId: number) => {
        reset();
        router.push('/edit/' + editId);
    };

    const onSaveSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                const res = await addEdit({
                    secret: String(secret),
                    content_type: 'character',
                    slug: slug,
                    after: {
                        ...getEditParams(data),
                    },
                    auto: data.auto || false,
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

    const switchParam = (param: keyof Hikka.CharacterEditParams) => {
        setEditParams((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param],
        );
    };

    if (!character) {
        return null;
    }

    return (
        <div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-6">
                    <InputParam<Hikka.CharacterEditParams>
                        title="Імʼя персонажа"
                        selected={editParams}
                        params={CHARACTER_TITLE_PARAMS}
                        content={character}
                        editor="input"
                        onSwitchParam={switchParam}
                        register={register}
                        control={control}
                        mode="edit"
                    />

                    <InputParam<Hikka.CharacterEditParams>
                        title="Опис персонажа"
                        editor="markdown"
                        selected={editParams}
                        params={CHARACTER_DESCRIPTION_PARAMS}
                        content={character}
                        onSwitchParam={switchParam}
                        register={register}
                        control={control}
                        mode="edit"
                    />

                    <EditDescription
                        register={register}
                        setValue={setValue}
                    />
                </div>
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
                            Створити
                        </Button>
                        <AutoButton onSaveSubmit={onSaveSubmit} handleSubmit={handleSubmit} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Component;
