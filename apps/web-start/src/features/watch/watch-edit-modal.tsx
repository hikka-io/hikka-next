'use client';

import {
    WatchResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { useCreateWatch, useDeleteWatch, useWatchBySlug } from '@hikka/react';
import { getTitle } from '@hikka/react/utils';
import { useStore } from '@tanstack/react-form';
import { createElement, useEffect, useState } from 'react';
import { toast } from 'sonner';

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

import { cn } from '@/utils/cn';
import { WATCH_STATUS } from '@/utils/constants/common';
import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    score: z.coerce.number().min(0).max(10).optional(),
    episodes: z.coerce.number().min(0).optional(),
    rewatches: z.coerce.number().min(0).optional(),
    note: z.string().nullable().optional(),
    start_date: z.coerce.number().nullable().optional(),
    end_date: z.coerce.number().nullable().optional(),
});

interface Props {
    slug: string;
    watch?: WatchResponse | WatchResponseBase;
    onClose?: () => void;
}

const Component = ({ slug, watch: watchProp, onClose }: Props) => {
    const { data: watchQuery } = useWatchBySlug({
        slug,
        options: { enabled: !watchProp },
    });

    const watch = watchProp || watchQuery;

    const { mutate: createWatch, isPending: addToListLoading } = useCreateWatch(
        {
            options: {
                onSuccess: (data) => {
                    toast.info(
                        <span>
                            <span className="font-bold">
                                {getTitle(
                                    data.anime as unknown as Record<
                                        string,
                                        unknown
                                    >,
                                )}
                            </span>{' '}
                            успішно оновлено.
                        </span>,
                    );
                    onClose?.();
                },
            },
        },
    );

    const { mutate: deleteWatch, isPending: deleteFromListLoading } =
        useDeleteWatch({
            options: {
                onSuccess: () => {
                    toast.success('Аніме успішно видалено.');
                    onClose?.();
                },
            },
        });

    const [selectedStatus, setSelectedStatus] = useState<
        WatchStatusEnum | undefined
    >(watch?.status);

    const form = useAppForm({
        defaultValues: {
            score: watch?.score ?? 0,
            episodes: watch?.episodes ?? 0,
            rewatches: watch?.rewatches ?? 0,
            note: watch?.note ?? null,
            start_date: (watch as any)?.start_date ?? null,
            end_date: (watch as any)?.end_date ?? null,
        },
        validators: { onSubmit: formSchema as never },
        onSubmit: async ({ value }) => {
            createWatch({
                slug,
                args: {
                    status: selectedStatus!,
                    ...value,
                },
            });
        },
    });

    const startDate = useStore(form.store, (s) => s.values.start_date);

    useEffect(() => {
        if (watch?.status) {
            setSelectedStatus(watch.status);
        }
    }, [watch]);

    if (!watch) return null;

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
                            setSelectedStatus(value[0] as WatchStatusEnum);
                        }}
                    >
                        <SelectTrigger size="md">
                            <div className="flex items-center gap-2">
                                {selectedStatus && (
                                    <div
                                        className={cn(
                                            'w-fit rounded-sm border p-1',
                                            `bg-${selectedStatus} text-${selectedStatus}-foreground border-${selectedStatus}-border`,
                                        )}
                                    >
                                        {createElement(
                                            WATCH_STATUS[selectedStatus].icon!,
                                            {
                                                className: 'size-3!',
                                            },
                                        )}
                                    </div>
                                )}
                                {(selectedStatus &&
                                    WATCH_STATUS[selectedStatus].title_ua) ||
                                    'Виберіть список'}
                            </div>
                            <SelectIcon />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {(
                                        Object.keys(
                                            WATCH_STATUS,
                                        ) as WatchStatusEnum[]
                                    ).map((status) => (
                                        <SelectItem value={status} key={status}>
                                            {WATCH_STATUS[status].title_ua}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
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
                                min={0}
                                max={10}
                            />
                        )}
                    />
                    <form.AppField
                        name="episodes"
                        children={(field) => (
                            <field.TextField
                                label="Епізоди"
                                placeholder="Введіть к-сть переглянутих епізодів"
                                type="number"
                                className="flex-1"
                                min={0}
                            />
                        )}
                    />
                </div>
                <form.AppField
                    name="rewatches"
                    children={(field) => (
                        <field.TextField
                            label="Повторні перегляди"
                            placeholder="Введіть к-сть повторних переглядів"
                            type="number"
                            min={0}
                        />
                    )}
                />
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
                    onClick={() => deleteWatch(slug)}
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
            </ResponsiveModalFooter>
        </form>
    );
};

export default Component;
