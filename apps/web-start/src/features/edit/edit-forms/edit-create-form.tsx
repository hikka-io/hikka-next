import { type FC, useRef } from 'react';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createEditMutation, type EditContentTypeEnum } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { invalidateEdits } from '@/utils/api/invalidate-content-state';
import { TURNSTILE_SITE_KEY } from '@/utils/constants/edit';
import { useRouter } from '@/utils/navigation';

import type { EditMainContent } from '../types';
import AutoButton from './components/auto-button';
import EditDescription from './components/edit-description';
import EditGroup from './components/edit-group';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from './utils/edit-param-utils';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
    mode?: 'view' | 'edit';
    content: EditMainContent;
};

const EditForm: FC<Props> = ({
    slug,
    content_type,
    content,
    mode = 'edit',
}) => {
    const captchaRef = useRef<TurnstileInstance>(undefined);

    const router = useRouter();
    const queryClient = useQueryClient();

    const params = getEditParams(content_type)!;
    const groups = getEditGroups(content_type)!;
    const paramSlugs = getEditParamSlugs(params);

    const onDismiss = (editId: number) => {
        form.reset();
        router.push(`/edit/${editId}`);
    };

    const mutationAddEdit = useMutation({
        ...createEditMutation(),
        onSuccess: (data) => {
            invalidateEdits(queryClient);
            onDismiss(data.edit_id);
        },
    });

    const form = useAppForm({
        defaultValues: {
            description: '',
            ...content,
            synonyms:
                (content &&
                    'synonyms' in content &&
                    content.synonyms!.map((v: string) => ({
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
                path: {
                    content_type: content_type,
                    slug: slug,
                },
                body: {
                    after: {
                        ...getFilteredEditParams(paramSlugs, value),
                    },
                    auto: (value as any).auto || false,
                    description: (value as any).description,
                },
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
                            siteKey={TURNSTILE_SITE_KEY}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                disabled={mutationAddEdit.isPending}
                                type="submit"
                                className="w-fit"
                            >
                                {mutationAddEdit.isPending && <Spinner />}
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
