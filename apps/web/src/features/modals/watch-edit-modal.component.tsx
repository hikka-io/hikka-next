'use client';

import {
    WatchResponse,
    WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/client';
import { useCreateWatch, useDeleteWatch, useWatchBySlug } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
import { WATCH_STATUS } from '@/utils/constants/common';
import { z } from '@/utils/zod';

import FormInput from '../../components/form/form-input';
import FormTextarea from '../../components/form/form-textarea';

const formSchema = z.object({
    score: z.coerce.number().min(0).max(10).optional(),
    episodes: z.coerce.number().min(0).optional(),
    rewatches: z.coerce.number().min(0).optional(),
    note: z.string().nullable().optional(),
});

interface Props {
    slug: string;
    watch?: WatchResponse | WatchResponseBase;
}

const Component = ({ slug, watch: watchProp }: Props) => {
    const { closeModal } = useModalContext();
    const { data: watchQuery } = useWatchBySlug({
        slug,
        options: { enabled: !watchProp },
    });

    const watch = watchProp || watchQuery;

    const { mutate: createWatch, isPending: addToListLoading } =
        useCreateWatch();

    const { mutate: deleteWatch, isPending: deleteFromListLoading } =
        useDeleteWatch();

    const [selectedStatus, setSelectedStatus] = useState<
        WatchStatusEnum | undefined
    >(watch?.status);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: watch,
    });

    const onDelete = async () => {
        deleteWatch(slug);
        closeModal();
    };

    useEffect(() => {
        if (watch?.status) {
            setSelectedStatus(watch.status);
        }
    }, [watch]);

    if (!watch) return null;

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
                                setSelectedStatus(value[0] as WatchStatusEnum);
                            }}
                        >
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    {selectedStatus &&
                                        createElement(
                                            WATCH_STATUS[selectedStatus].icon!,
                                        )}
                                    {(selectedStatus &&
                                        WATCH_STATUS[selectedStatus]
                                            .title_ua) ||
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
                                            <SelectItem
                                                value={status}
                                                key={status}
                                            >
                                                {WATCH_STATUS[status].title_ua}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
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
                            name="episodes"
                            label="Епізоди"
                            placeholder="Введіть к-сть переглянутих епізодів"
                            type="number"
                            className="flex-1"
                        />
                    </div>
                    <FormInput
                        name="rewatches"
                        label="Повторні перегляди"
                        placeholder="Введіть к-сть повторних переглядів"
                        type="number"
                    />
                    <FormTextarea
                        name="note"
                        label="Нотатки"
                        placeholder="Залиште нотатку до аніме"
                    />
                </div>
                <div className="grid w-full grid-cols-2 gap-8">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        disabled={addToListLoading || deleteFromListLoading}
                    >
                        {deleteFromListLoading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Видалити
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={form.handleSubmit((data) =>
                            createWatch({
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
                        {addToListLoading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Зберегти
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Component;
