'use client';

import {
    ReadContentType,
    ReadResponseBase,
    ReadStatusEnum,
} from '@hikka/client';
import { useAddOrUpdateRead, useDeleteRead, useReadEntry } from '@hikka/react';
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
import { READ_STATUS } from '@/utils/constants/common';
import { z } from '@/utils/zod';

import FormInput from '../../components/form/form-input';
import FormTextarea from '../../components/form/form-textarea';

const formSchema = z.object({
    score: z.coerce.number().min(0).max(10).optional(),
    volumes: z.coerce.number().min(0).optional(),
    chapters: z.coerce.number().min(0).optional(),
    rereads: z.coerce.number().min(0).optional(),
    note: z.string().nullable().optional(),
});

interface Props {
    slug: string;
    content_type: ReadContentType;
    read?: ReadResponseBase;
}

const Component = ({ slug, content_type, read: readProp }: Props) => {
    const { closeModal } = useModalContext();
    const { data: readQuery } = useReadEntry({
        contentType: content_type,
        slug,
        options: {
            enabled: !readProp,
        },
    });

    const read = readProp || readQuery;

    const { mutate: addOrUpdateRead, isPending: addToListLoading } =
        useAddOrUpdateRead({});

    const { mutate: deleteRead, isPending: deleteFromListLoading } =
        useDeleteRead({});

    const [selectedStatus, setSelectedStatus] = useState<
        ReadStatusEnum | undefined
    >(read?.status);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: read,
    });

    const onDelete = async () => {
        deleteRead({
            contentType: content_type,
            slug,
        });
        closeModal();
    };

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
                                    {selectedStatus &&
                                        createElement(
                                            READ_STATUS[selectedStatus].icon!,
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
                            addOrUpdateRead({
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
