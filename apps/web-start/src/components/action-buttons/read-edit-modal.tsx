import { createElement, useEffect, useState } from 'react';

import { useStore } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    deleteReadMutation,
    type ReadArgs,
    type ReadContentTypeEnum,
    type ReadResponseBase,
    type ReadStatusEnum,
    readAddMutation,
    readGetOptions,
    readGetQueryKey,
} from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import MaterialSymbolsCheckRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckRounded';
import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';
import { z } from '@/utils/i18n/zod';
import { getTitle } from '@/utils/title/get-title';

const formSchema = z.object({
    score: z.coerce.number().min(0).max(10).optional(),
    volumes: z.coerce.number().min(0).optional(),
    chapters: z.coerce.number().min(0).optional(),
    rereads: z.coerce.number().min(0).optional(),
    note: z.string().nullable().optional(),
    start_date: z.coerce.number().nullable().optional(),
    end_date: z.coerce.number().nullable().optional(),
});

type Props = {
    slug: string;
    content_type: ReadContentTypeEnum;
    read?: ReadResponseBase;
    onClose?: () => void;
};

const ReadEditModal = ({
    slug,
    content_type,
    read: readProp,
    onClose,
}: Props) => {
    const queryClient = useQueryClient();

    const { data: readQuery } = useQuery({
        ...readGetOptions({ path: { content_type, slug } }),
        enabled: !readProp,
    });

    const read = readProp || readQuery;

    const invalidateReadLists = () =>
        queryClient.invalidateQueries({
            predicate: (query) =>
                (query.queryKey[0] as { _id?: string } | undefined)?._id ===
                'userReadList',
        });

    const { mutate: createRead, isPending: addToListLoading } = useMutation({
        ...readAddMutation(),
        onSuccess: (data, { path }) => {
            queryClient.setQueryData(
                readGetQueryKey({
                    path: { content_type: path.content_type, slug: path.slug },
                }),
                data,
            );
            invalidateReadLists();
            toast.success(
                <span>
                    <span className="font-bold">{getTitle(data.content)}</span>{' '}
                    успішно оновлено.
                </span>,
            );
            onClose?.();
        },
    });

    const { mutate: deleteRead, isPending: deleteFromListLoading } =
        useMutation({
            ...deleteReadMutation(),
            onSuccess: (_data, { path }) => {
                queryClient.removeQueries({
                    queryKey: readGetQueryKey({
                        path: {
                            content_type: path.content_type,
                            slug: path.slug,
                        },
                    }),
                });
                invalidateReadLists();
                toast.success('Контент успішно видалено.');
                onClose?.();
            },
        });

    const [selectedStatus, setSelectedStatus] = useState<
        ReadStatusEnum | undefined
    >(read?.status as ReadStatusEnum | undefined);

    const form = useAppForm({
        defaultValues: {
            score: read?.score ?? 0,
            volumes: read?.volumes ?? 0,
            chapters: read?.chapters ?? 0,
            rereads: read?.rereads ?? 0,
            note: read?.note ?? null,
            start_date:
                (read as { start_date?: number | null })?.start_date ?? null,
            end_date: (read as { end_date?: number | null })?.end_date ?? null,
        },
        validators: { onSubmit: formSchema as never },
        onSubmit: async ({ value }) => {
            createRead({
                path: { content_type, slug },
                // TODO(phase2): start_date/end_date are `number | null` in the
                // form but typed `string | null` in the generated ReadArgs.
                body: {
                    status: selectedStatus!,
                    ...value,
                } as unknown as ReadArgs,
            });
        },
    });

    const startDate = useStore(form.store, (s) => s.values.start_date);

    useEffect(() => {
        if (read?.status) {
            setSelectedStatus(read.status as ReadStatusEnum);
        }
    }, [read]);

    if (!read) return null;

    return (
        <form
            className="contents"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
                <div className="flex w-full flex-col gap-2">
                    <Label>Список</Label>
                    <Select
                        value={selectedStatus && [selectedStatus]}
                        onValueChange={(value) => {
                            setSelectedStatus(value[0] as ReadStatusEnum);
                        }}
                    >
                        <SelectTrigger size="md">
                            <div className="flex items-center gap-2">
                                {selectedStatus && (
                                    <div
                                        className={cn(
                                            'w-fit rounded-sm border border-white p-1 text-white',
                                            `bg-${selectedStatus} text-${selectedStatus}-foreground border-${selectedStatus}-border`,
                                        )}
                                    >
                                        {createElement(
                                            READ_STATUS[selectedStatus].icon!,
                                            {
                                                className: 'size-3!',
                                            },
                                        )}
                                    </div>
                                )}
                                {(selectedStatus &&
                                    READ_STATUS[selectedStatus].title_ua) ||
                                    'Виберіть список'}
                            </div>
                            <SelectIcon />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {(
                                        Object.keys(
                                            READ_STATUS,
                                        ) as ReadStatusEnum[]
                                    ).map((status) => (
                                        <SelectItem value={status} key={status}>
                                            {READ_STATUS[status].title_ua}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-full gap-8">
                    <form.AppField
                        name="volumes"
                        children={(field) => (
                            <field.TextField
                                label="Томи"
                                placeholder="Введіть к-сть прочитаних томів"
                                type="number"
                                className="flex-1"
                            />
                        )}
                    />
                    <form.AppField
                        name="chapters"
                        children={(field) => (
                            <field.TextField
                                label="Розділи"
                                placeholder="Введіть к-сть прочитаних розділів"
                                type="number"
                                className="flex-1"
                            />
                        )}
                    />
                </div>
                <div className="flex w-full gap-8">
                    <form.AppField
                        name="score"
                        children={(field) => (
                            <field.TextField
                                label="Оцінка"
                                placeholder="Введіть оцінку"
                                type="number"
                                className="flex-1"
                            />
                        )}
                    />
                    <form.AppField
                        name="rereads"
                        children={(field) => (
                            <field.TextField
                                label="Повторні читання"
                                placeholder="Введіть к-сть повторних читань"
                                type="number"
                                className="flex-1"
                            />
                        )}
                    />
                </div>

                <div className="flex w-full gap-8">
                    <form.AppField
                        name="start_date"
                        children={(field) => (
                            <field.DatePickerField
                                className="flex-1"
                                label="Дата початку"
                            />
                        )}
                    />
                    <form.AppField
                        name="end_date"
                        children={(field) => (
                            <field.DatePickerField
                                className="flex-1"
                                label="Дата завершення"
                                minDate={startDate ?? undefined}
                            />
                        )}
                    />
                </div>
                <form.AppField
                    name="note"
                    children={(field) => (
                        <field.TextareaField
                            label="Нотатки"
                            placeholder="Залиште нотатку"
                        />
                    )}
                />
            </div>
            <ResponsiveModalFooter>
                <Button
                    type="button"
                    variant="destructive"
                    size="md"
                    onClick={() =>
                        deleteRead({
                            path: { content_type, slug },
                        })
                    }
                    disabled={addToListLoading || deleteFromListLoading}
                >
                    {deleteFromListLoading ? (
                        <Spinner />
                    ) : (
                        <MaterialSymbolsDeleteForeverRounded className="size-4" />
                    )}
                    Видалити
                </Button>
                <Button
                    size="md"
                    type="submit"
                    disabled={addToListLoading || deleteFromListLoading}
                >
                    {addToListLoading ? (
                        <Spinner />
                    ) : (
                        <MaterialSymbolsCheckRounded className="size-4" />
                    )}
                    Зберегти
                </Button>
            </ResponsiveModalFooter>
        </form>
    );
};

export default ReadEditModal;
