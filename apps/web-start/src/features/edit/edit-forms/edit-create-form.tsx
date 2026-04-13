'use client';

import { EditContentType, MainContent } from '@hikka/client';
import { useCreateEdit } from '@hikka/react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { FC, useRef } from 'react';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';

import { useRouter } from '@/utils/navigation';

import AutoButton from './components/auto-button';
import EditDescription from './components/edit-description';
import EditGroup from './components/edit-group';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from './utils/edit-param-utils';

interface Props {
    slug: string;
    content_type: EditContentType;
    mode?: 'view' | 'edit';
    content: MainContent;
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

    const onDismiss = (editId: number) => {
        form.reset();
        router.push('/edit/' + editId);
    };

    const mutationAddEdit = useCreateEdit({
        options: {
            onSuccess: (data) => onDismiss(data.edit_id),
        },
    });

    const form = useAppForm({
        defaultValues: {
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
        } as Record<string, unknown> & {
            description: string;
            auto: boolean;
        },
        onSubmit: async ({ value }) => {
            mutationAddEdit.mutate({
                content_type: content_type,
                slug: slug,
                after: {
                    ...getFilteredEditParams(paramSlugs, value),
                },
                auto: (value as any).auto || false,
                description: (value as any).description,
            });
        },
    });

    return (
        <form.AppForm>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
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
                                disabled={mutationAddEdit.isPending}
                                type="submit"
                                className="w-fit"
                            >
                                {mutationAddEdit.isPending && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                Створити
                            </Button>
                            <AutoButton />
                        </div>
                    </div>
                )}
            </form>
        </form.AppForm>
    );
};

export default EditForm;
