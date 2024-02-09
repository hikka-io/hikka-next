'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import { useCharacterInfo } from '@/app/page.hooks';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import addEdit from '@/services/api/edit/addEdit';
import {
    CHARACTER_DESCRIPTION_PARAMS,
    CHARACTER_TITLE_PARAMS,
} from '@/utils/constants';
import { useAuthContext } from '@/services/providers/auth-provider';

import InputParam from '../../../../_components/ui/input-param';


type FormValues = Hikka.CharacterEditParams & {
    description: string;
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
                    content_type: 'character',
                    slug: slug,
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