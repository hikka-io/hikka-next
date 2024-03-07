'use client';

import { createElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useAddToList from '@/services/hooks/watch/useAddToList';
import useDeleteFromList from '@/services/hooks/watch/useDeleteFromList';
import useWatch from '@/services/hooks/watch/useWatch';
import { useModalContext } from '@/services/providers/modal-provider';
import { WATCH_STATUS } from '@/utils/constants';

type FormValues = {
    score: number;
    episodes: number;
    rewatches: number;
    note: string;
};

interface Props {
    slug: string;
}

const Component = ({ slug }: Props) => {
    const { closeModal } = useModalContext();
    const { data: watch, isError: watchError } = useWatch({ slug });

    const { mutate: addToList, isPending: addToListLoading } = useAddToList({
        slug,
    });

    const { mutate: deleteFromList, isPending: deleteFromListLoading } =
        useDeleteFromList({ slug });

    const [selectedStatus, setSelectedStatus] = useState<
        API.WatchStatus | undefined
    >(watch?.status);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSaveSubmit = async (data: FormValues) => {
        if (data.score && (data.score > 10 || data.score < 0)) {
            return;
        }

        if (data.episodes && data.episodes < 0) {
            return;
        }

        addToList({
            status: selectedStatus!,
            score: data.score || undefined,
            episodes: data.episodes || undefined,
            note: data.note || undefined,
            rewatches: data.rewatches || undefined,
        });

        closeModal();
    };

    useEffect(() => {
        if (watch?.status) {
            setSelectedStatus(watch.status);
        }
    }, [watch]);

    return (
        watch && (
            <div className="flex flex-col gap-6">
                <div className="flex w-full flex-col gap-6">
                    <div className="w-full flex flex-col gap-2">
                        <Label>Список</Label>
                        <Combobox
                            options={Object.keys(WATCH_STATUS).map(
                                (status) => ({
                                    label: WATCH_STATUS[
                                        status as API.WatchStatus
                                    ].title_ua,
                                    value: status,
                                }),
                            )}
                            onChange={(value) => {
                                setSelectedStatus(value as API.WatchStatus);
                            }}
                            value={selectedStatus}
                            renderValue={(option) => {
                                return (
                                    <div className="flex gap-2 items-center">
                                        {option &&
                                            !Array.isArray(option) &&
                                            createElement(
                                                WATCH_STATUS[
                                                    option.value as API.WatchStatus
                                                ].icon!,
                                            )}
                                        {(option &&
                                            !Array.isArray(option) &&
                                            option?.label) ||
                                            'Виберіть список'}
                                    </div>
                                );
                            }}
                        />
                    </div>
                    <div className="flex gap-8">
                        <div className="w-full flex flex-col gap-2">
                            <Label>Оцінка</Label>
                            <Input
                                type="number"
                                placeholder="Введіть оцінку"
                                {...register('score', {
                                    value: watch.score || undefined,
                                    valueAsNumber: true,
                                })}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Label>Епізоди</Label>
                            <Input
                                type="number"
                                placeholder="Введіть к-сть переглянутих епізодів"
                                {...register('episodes', {
                                    value: watch.episodes || undefined,
                                    valueAsNumber: true,
                                })}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <Label>Повторні перегляди</Label>
                        <Input
                            type="number"
                            placeholder="Введіть к-сть повторних переглядів"
                            {...register('rewatches', {
                                value: watch.rewatches || undefined,
                                valueAsNumber: true,
                            })}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <Label>Нотатки</Label>
                        <Textarea
                            placeholder="Залиште нотатку до аніме"
                            rows={3}
                            {...register('note', {
                                value: watch.note || undefined,
                            })}
                        />
                    </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-8">
                    <Button
                        variant="destructive"
                        onClick={handleSubmit(() => deleteFromList())}
                        disabled={
                            isSubmitting ||
                            addToListLoading ||
                            deleteFromListLoading
                        }
                    >
                        {deleteFromListLoading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Видалити
                    </Button>
                    <Button
                        variant="accent"
                        onClick={handleSubmit(onSaveSubmit)}
                        type="submit"
                        disabled={
                            isSubmitting ||
                            addToListLoading ||
                            deleteFromListLoading
                        }
                    >
                        {addToListLoading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Зберегти
                    </Button>
                </div>
            </div>
        )
    );
};

export default Component;
