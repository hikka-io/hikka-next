'use client';

import {
    ReadContentType,
    ReadResponseBase,
    ReadStatusEnum,
} from '@hikka/client';
import { useCreateRead, useDeleteRead, useReadBySlug } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormDatePicker from '@/components/form/form-date-picker';
import FormInput from '@/components/form/form-input';
import FormTextarea from '@/components/form/form-textarea';
import MaterialSymbolsCheckRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckRounded';
import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';
import { READ_STATUS } from '@/utils/constants/common';
import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    score: z.coerce.number().min(0).max(10).optional(),
    volumes: z.coerce.number().min(0).optional(),
    chapters: z.coerce.number().min(0).optional(),
    rereads: z.coerce.number().min(0).optional(),
    note: z.string().nullable().optional(),
    start_date: z.coerce.number().nullable().optional(),
    end_date: z.coerce.number().nullable().optional(),
});

interface Props {
    slug: string;
    content_type: ReadContentType;
    read?: ReadResponseBase;
}

const Component = ({ slug, content_type, read: readProp }: Props) => {
    const { closeModal } = useModalContext();
    const { data: readQuery } = useReadBySlug({
        contentType: content_type,
        slug,
        options: {
            enabled: !readProp,
        },
    });

    const read = readProp || readQuery;

    const { mutate: createRead, isPending: addToListLoading } = useCreateRead({
        options: {
            onSuccess: (data) => {
                toast.success(
                    <span>
                        <span className="font-bold">{data.content.title}</span>{' '}
                        успішно оновлено.
                    </span>,
                );
                closeModal();
            },
        },
    });

    const { mutate: deleteRead, isPending: deleteFromListLoading } =
        useDeleteRead({
            options: {
                onSuccess: () => {
                    toast.success('Контент успішно видалено.');
                    closeModal();
                },
            },
        });

    const [selectedStatus, setSelectedStatus] = useState<
        ReadStatusEnum | undefined
    >(read?.status);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: read,
    });

    useEffect(() => {
        if (read?.status) {
            setSelectedStatus(read.status);
        }
    }, [read]);

    if (!read) return null;

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-6">
                    <div className="flex w-full flex-col gap-2">
                        <Label>Список</Label>
                        <Select
                            value={selectedStatus && [selectedStatus]}
                            onValueChange={(value) => {
                                setSelectedStatus(value[0] as ReadStatusEnum);
                            }}
                        >
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    {selectedStatus && (
                                        <div
                                            className={cn(
                                                'w-fit rounded-sm border border-white p-1 text-white',
                                                `bg-${selectedStatus} text-${selectedStatus}-foreground border-${selectedStatus}-border`,
                                            )}
                                        >
                                            {createElement(
                                                READ_STATUS[selectedStatus]
                                                    .icon!,
                                                {
                                                    className: '!size-3',
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
                                            <SelectItem
                                                value={status}
                                                key={status}
                                            >
                                                {READ_STATUS[status].title_ua}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-full gap-8">
                        <FormInput
                            name="volumes"
                            label="Томи"
                            placeholder="Введіть к-сть прочитаних томів"
                            type="number"
                            className="flex-1"
                        />
                        <FormInput
                            name="chapters"
                            label="Розділи"
                            placeholder="Введіть к-сть прочитаних розділів"
                            type="number"
                            className="flex-1"
                        />
                    </div>
                    <div className="flex w-full gap-8">
                        <FormInput
                            name="score"
                            label="Оцінка"
                            placeholder="Введіть оцінку"
                            type="number"
                            className="flex-1"
                        />
                        <FormInput
                            name="rereads"
                            label="Повторні читання"
                            placeholder="Введіть к-сть повторних читань"
                            type="number"
                            className="flex-1"
                        />
                    </div>

                    <div className="flex w-full gap-8">
                        <FormDatePicker
                            className="flex-1"
                            name="start_date"
                            label="Дата початку"
                        />
                        <FormDatePicker
                            className="flex-1"
                            name="end_date"
                            label="Дата завершення"
                            minDate={form.watch('start_date') ?? undefined}
                        />
                    </div>
                    <FormTextarea
                        name="note"
                        label="Нотатки"
                        placeholder="Залиште нотатку"
                    />
                </div>
                <div className="flex w-full justify-end gap-4">
                    <Button
                        type="button"
                        variant="destructive"
                        size="md"
                        onClick={() =>
                            deleteRead({
                                contentType: content_type,
                                slug,
                            })
                        }
                        disabled={addToListLoading || deleteFromListLoading}
                    >
                        {deleteFromListLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <MaterialSymbolsDeleteForeverRounded className="size-4" />
                        )}
                        Видалити
                    </Button>
                    <Button
                        size="md"
                        onClick={form.handleSubmit((data) =>
                            createRead({
                                contentType: content_type,
                                slug,
                                args: {
                                    status: selectedStatus!,
                                    ...data,
                                },
                            }),
                        )}
                        type="submit"
                        disabled={addToListLoading || deleteFromListLoading}
                    >
                        {addToListLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <MaterialSymbolsCheckRounded className="size-4" />
                        )}
                        Зберегти
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Component;
