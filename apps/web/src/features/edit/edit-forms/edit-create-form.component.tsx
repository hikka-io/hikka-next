'use client';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '../../../components/ui/button';
import addEdit from '../../../services/api/edit/addEdit';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from '../../../utils/edit-param-utils';
import AutoButton from './auto-button';
import EditDescription from './edit-description';
import EditGroup from './edit-group';

type FormValues = Record<string, unknown> & {
    description: string;
    auto?: boolean;
};

interface Props {
    slug: string;
    content_type: API.ContentType;
    mode?: 'view' | 'edit';
    content: API.MainContent;
}

const EditForm: FC<Props> = ({
    slug,
    content_type,
    content,
    mode = 'edit',
}) => {
    const captchaRef = useRef<TurnstileInstance>(undefined);

    const router = useRouter();

    const params = getEditParams(content_type)!;
    const groups = getEditGroups(content_type)!;
    const paramSlugs = getEditParamSlugs(params);

    const form = useForm<FormValues>({
        values: {
            description: '',
            ...content,
            synonyms:
                (content &&
                    'synonyms' in content &&
                    content?.synonyms!.map((v: string) => ({
                        value: v,
                    }))) ||
                [],
            auto: false,
        },
    });

    const mutation = useMutation({
        mutationFn: addEdit,
        onSuccess: (data) => onDismiss(data.edit_id),
    });

    const onDismiss = (editId: number) => {
        form.reset();
        router.push('/edit/' + editId);
    };

    const onSubmit = async (data: FormValues) => {
        mutation.mutate({
            params: {
                content_type: content_type,
                slug: slug,
                after: {
                    ...getFilteredEditParams(paramSlugs, data),
                },
                auto: data.auto || false,
                description: data.description,
            },
            captcha: String(captchaRef.current?.getResponse()),
        });
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
                            options={{
                                refreshExpired: 'manual',
                            }}
                            ref={captchaRef}
                            siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                disabled={mutation.isPending}
                                onClick={form.handleSubmit(onSubmit)}
                                type="submit"
                                className="w-fit"
                            >
                                {mutation.isPending && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                Створити
                            </Button>
                            <AutoButton
                                onSubmit={onSubmit}
                                handleSubmit={form.handleSubmit}
                            />
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    );
};

export default EditForm;
