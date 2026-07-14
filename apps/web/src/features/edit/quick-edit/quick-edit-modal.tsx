import { type FC, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createEditMutation, type EditContentTypeEnum } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import MaterialSymbolsCheckRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import Spinner from '@/components/ui/spinner';
import {
    invalidateContentBySlug,
    invalidateEdits,
} from '@/utils/api/invalidate-content-state';

import EditFormFields from '../edit-forms/components/edit-form-fields';
import {
    getEditFormDefaults,
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
    isNativeTitleMissing,
} from '../edit-forms/utils/edit-param-utils';
import { useContentBySlug } from '../hooks/use-content-by-slug';
import type { EditMainContent } from '../types';

type Props = {
    slug: string;
    content_type: EditContentTypeEnum;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type FormProps = {
    slug: string;
    content_type: EditContentTypeEnum;
    content: EditMainContent;
    onSuccess: () => void;
};

const QuickEditForm: FC<FormProps> = ({
    slug,
    content_type,
    content,
    onSuccess,
}) => {
    const queryClient = useQueryClient();
    const [pendingAuto, setPendingAuto] = useState<boolean | null>(null);

    const params = getEditParams(content_type)!;
    const groups = getEditGroups(content_type)!;
    const paramSlugs = getEditParamSlugs(params);
    const nativeTitleMissing = isNativeTitleMissing(content_type, content);

    const mutation = useMutation({
        ...createEditMutation(),
        onSuccess: (_data, variables) => {
            const accepted =
                (variables.body as { auto?: boolean } | undefined)?.auto ??
                false;

            invalidateEdits(queryClient);
            if (accepted) {
                invalidateContentBySlug(queryClient, slug);
            }

            toast.success(
                accepted ? 'Правку створено та прийнято' : 'Правку створено',
            );
            onSuccess();
        },
        onError: () => setPendingAuto(null),
    });

    const form = useAppForm({
        defaultValues: getEditFormDefaults(content, true),
        onSubmit: async ({ value }) => {
            mutation.mutate({
                path: { content_type, slug },
                body: {
                    after: { ...getFilteredEditParams(paramSlugs, value) },
                    auto: value.auto || false,
                    description: value.description,
                },
            });
        },
    });

    const submitWith = (auto: boolean) => {
        setPendingAuto(auto);
        form.setFieldValue('auto', auto);
        form.handleSubmit();
    };

    return (
        <form.AppForm>
            <form
                className="contents"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    submitWith(true);
                }}
            >
                <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4 [--plate-sticky-top:-1rem]">
                    <EditFormFields
                        params={params}
                        groups={groups}
                        mode="edit"
                        nativeTitleMissing={nativeTitleMissing}
                        defaultOpen
                    />
                </div>
                <ResponsiveModalFooter>
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        disabled={mutation.isPending}
                        onClick={() => submitWith(false)}
                    >
                        {pendingAuto === false ? (
                            <Spinner />
                        ) : (
                            <MaterialSymbolsEditRounded className="size-4" />
                        )}
                        Створити
                    </Button>
                    <Button
                        type="button"
                        size="md"
                        disabled={mutation.isPending}
                        onClick={() => submitWith(true)}
                    >
                        {pendingAuto === true ? (
                            <Spinner />
                        ) : (
                            <MaterialSymbolsCheckRounded className="size-4" />
                        )}
                        Прийняти
                    </Button>
                </ResponsiveModalFooter>
            </form>
        </form.AppForm>
    );
};

const QuickEditModalBody: FC<Omit<Props, 'open'>> = ({
    slug,
    content_type,
    onOpenChange,
}) => {
    const content = useContentBySlug(content_type, slug);

    return (
        <div
            className="contents"
            data-slug={slug}
            data-content-type={content_type}
        >
            {content ? (
                <QuickEditForm
                    slug={slug}
                    content_type={content_type}
                    content={content}
                    onSuccess={() => onOpenChange(false)}
                />
            ) : (
                <div className="flex min-h-40 flex-1 items-center justify-center">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

const QuickEditModal: FC<Props> = ({
    slug,
    content_type,
    open,
    onOpenChange,
}) => {
    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange} forceDesktop>
            <ResponsiveModalContent
                className="md:max-w-2xl"
                title="Швидка правка"
            >
                <QuickEditModalBody
                    slug={slug}
                    content_type={content_type}
                    onOpenChange={onOpenChange}
                />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};

export default QuickEditModal;
