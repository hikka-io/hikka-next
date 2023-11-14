'use client';

import Modal from '@/app/_components/Modal';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import {
    createElement,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getWatch from '@/utils/api/watch/getWatch';
import Select from '@/app/_components/Select';
import { WATCH_STATUS } from '@/utils/constants';
import addWatch from '@/utils/api/watch/addWatch';
import deleteWatch from '@/utils/api/watch/deleteWatch';

type FormValues = {
    score: number;
    episodes: number;
    note: string;
};

interface Props {
    slug: string | null;
    setSlug: Dispatch<SetStateAction<string | null>>;
}

const Component = ({ slug, setSlug }: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const { data: watch, isError: watchError } = useQuery({
        queryKey: ['watch', secret, slug],
        queryFn: () => getWatch({ slug: String(slug), secret: String(secret) }),
        staleTime: 0,
        cacheTime: 0,
    });
    const [selectedStatus, setSelectedStatus] = useState<
        Hikka.WatchStatus | undefined
    >(watch?.status);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();
    const { mutate: addToList, isLoading: addToListLoading } = useMutation({
        mutationKey: ['addToList', secret, slug, selectedStatus],
        mutationFn: (mutationParams: {
            score?: number;
            episodes?: number;
            note?: string;
        }) =>
            addWatch({
                secret: String(secret),
                slug: String(slug),
                status: selectedStatus!,
                ...mutationParams,
            }),
        onSuccess: async () => {
            onDismiss();
            await queryClient.invalidateQueries(['list']);
            await queryClient.invalidateQueries(['watch']);
        },
    });

    const { mutate: deleteFromList, isLoading: deleteFromListLoading } =
        useMutation({
            mutationKey: ['deleteFromList', secret, slug],
            mutationFn: () =>
                deleteWatch({
                    secret: String(secret),
                    slug: String(slug),
                }),
            onSuccess: async () => {
                onDismiss();
                await queryClient.invalidateQueries(['list']);
                await queryClient.invalidateQueries(['watch']);
            },
        });

    const onSaveSubmit = async (data: FormValues) => {
        if (data.score && (data.score > 10 || data.score < 0)) {
            return;
        }

        if (data.episodes && data.episodes < 0) {
            return;
        }

        addToList({
            score: data.score || undefined,
            episodes: data.episodes || undefined,
            note: data.note || undefined,
        });
    };

    const onDismiss = () => {
        window.watchEditModal.close();
        setTimeout(() => setSlug(null), 300);
        reset();
    };

    useEffect(() => {
        if (watch?.status) {
            setSelectedStatus(watch.status);
        }
    }, [watch]);

    return (
        <Modal
            open={Boolean(slug) && Boolean(watch)}
            onDismiss={onDismiss}
            id="watchEditModal"
            boxClassName="p-0 !max-w-xl"
            title={
                watch?.anime.title_ua ||
                watch?.anime.title_en ||
                watch?.anime.title_ja ||
                ''
            }
        >
            {watch && (
                <form className="py-8 px-8 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-2">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text-alt text-neutral">
                                    Список
                                </span>
                            </label>
                            <Select
                                onChange={(e, value) =>
                                    setSelectedStatus(
                                        value as Hikka.WatchStatus,
                                    )
                                }
                                value={selectedStatus}
                                toggleClassName="btn-secondary"
                                renderValue={(value) => (
                                    <div className="flex gap-2">
                                        {value && !Array.isArray(value) &&
                                            createElement(
                                                WATCH_STATUS[
                                                    value.value as Hikka.WatchStatus
                                                ].icon,
                                            )}
                                        {value && !Array.isArray(value) && value?.label || 'Виберіть список'}
                                    </div>
                                )}
                            >
                                {Object.keys(WATCH_STATUS).map((status) => (
                                    <Select.Option value={status} key={status}>
                                        {
                                            WATCH_STATUS[
                                                status as Hikka.WatchStatus
                                            ].title_ua
                                        }
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div className="flex gap-8">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text-alt text-neutral">
                                        Оцінка
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Введіть оцінку"
                                    className="input bg-secondary w-full"
                                    {...register('score', {
                                        value: watch.score || undefined,
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text-alt text-neutral">
                                        Епізоди
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="Введіть к-сть переглянутих епізодів"
                                    className="input bg-secondary w-full"
                                    {...register('episodes', {
                                        value: watch.episodes || undefined,
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text-alt text-neutral">
                                    Нотатки
                                </span>
                            </label>
                            <textarea
                                placeholder="Залиште нотатку до аніме"
                                rows={3}
                                className="textarea textarea-ghost text-base bg-secondary w-full"
                                {...register('note', {
                                    value: watch.note || undefined,
                                })}
                            />
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-8">
                        <button
                            onClick={handleSubmit(() => deleteFromList())}
                            disabled={
                                isSubmitting ||
                                addToListLoading ||
                                deleteFromListLoading
                            }
                            className="btn btn-error"
                        >
                            {deleteFromListLoading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Видалити
                        </button>
                        <button
                            onClick={handleSubmit(onSaveSubmit)}
                            type="submit"
                            disabled={
                                isSubmitting ||
                                addToListLoading ||
                                deleteFromListLoading
                            }
                            className="btn btn-accent"
                        >
                            {addToListLoading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Зберегти
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default Component;
