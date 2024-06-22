'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import FormTextarea from '@/components/form/form-textarea';
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

import useAddWatch from '@/services/hooks/watch/use-add-watch';
import useDeleteWatch from '@/services/hooks/watch/use-delete-watch';
import useWatch from '@/services/hooks/watch/use-watch';
import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants';
import { z } from '@/utils/zod';

const formSchema = z.object({
    score: z.coerce.number().min(0).max(10).nullable().optional(),
    episodes: z.coerce.number().min(0).nullable().optional(),
    rewatches: z.coerce.number().min(0).nullable().optional(),
    note: z.string().nullable().optional(),
});

interface Props {
    slug: string;
}

const Component = ({ slug }: Props) => {
    const { closeModal } = useModalContext();
    const { data: watch } = useWatch({ slug });

    const { mutate: addWatch, isPending: addToListLoading } = useAddWatch();

    const { mutate: deleteWatch, isPending: deleteFromListLoading } =
        useDeleteWatch();

    const [selectedStatus, setSelectedStatus] = useState<
        API.WatchStatus | undefined
    >(watch?.status);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: watch,
    });

    const onDelete = async () => {
        deleteWatch({ params: { slug } });
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
                                setSelectedStatus(value[0] as API.WatchStatus);
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
                                            ) as API.WatchStatus[]
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
                        variant="accent"
                        onClick={form.handleSubmit((data) =>
                            addWatch({
                                params: {
                                    slug,
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
