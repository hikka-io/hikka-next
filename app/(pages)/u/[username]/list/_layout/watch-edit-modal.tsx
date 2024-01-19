'use client';

import {
    Dispatch,
    SetStateAction,
    createElement,
    useEffect,
    useState,
} from 'react';
import { useForm } from 'react-hook-form';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Modal from '@/app/_components/modal';
import { Combobox } from '@/app/_components/ui/combobox';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Textarea } from '@/app/_components/ui/textarea';
import addWatch from '@/utils/api/watch/addWatch';
import deleteWatch from '@/utils/api/watch/deleteWatch';
import getWatch from '@/utils/api/watch/getWatch';
import { WATCH_STATUS } from '@/utils/constants';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';


type FormValues = {
    score: number;
    episodes: number;
    rewatches: number;
    note: string;
};

interface Props {
    slug: string | null;
    setSlug: Dispatch<SetStateAction<string | null>>;
}

const Component = ({ slug, setSlug }: Props) => {
    const { animeSettings, closeModals, switchModal } = useModalContext();
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
            rewatches?: number;
        }) =>
            addWatch({
                secret: String(secret),
                slug: String(slug),
                status: selectedStatus!,
                ...mutationParams,
            }),
        onSuccess: async () => {
            onDismiss(false);
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
                onDismiss(false);
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
            rewatches: data.rewatches || undefined,
        });
    };

    const onDismiss = (open: boolean) => {
        switchModal('animeSettings', open);
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
            open={Boolean(animeSettings) && Boolean(watch)}
            onOpenChange={onDismiss}
            id="watchEditModal"
            boxClassName="!max-w-xl"
            title={
                watch?.anime.title_ua ||
                watch?.anime.title_en ||
                watch?.anime.title_ja ||
                ''
            }
        >
            {watch && (
                <div className="flex flex-col gap-6">
                    <div className="flex w-full flex-col gap-6">
                        <div className="w-full flex flex-col gap-2">
                            <Label>Список</Label>
                            <Combobox
                                options={Object.keys(WATCH_STATUS).map(
                                    (status) => ({
                                        label: WATCH_STATUS[
                                            status as Hikka.WatchStatus
                                        ].title_ua,
                                        value: status,
                                    }),
                                )}
                                onChange={(value) =>
                                    {
                                        setSelectedStatus(
                                            value as Hikka.WatchStatus,
                                        )
                                    }
                                }
                                value={selectedStatus}
                                renderValue={(option) => {
                                    return <div className="flex gap-2 items-center">
                                        {option &&
                                            !Array.isArray(option) &&
                                            createElement(
                                                WATCH_STATUS[
                                                    option.value as Hikka.WatchStatus
                                                    ].icon,
                                            )}
                                        {(option &&
                                                !Array.isArray(option) &&
                                                option?.label) ||
                                            'Виберіть список'}
                                    </div>
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
            )}
        </Modal>
    );
};

export default Component;