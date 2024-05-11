'use client';

import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import MaterialSymbolsCheckSmallRounded from '~icons/material-symbols/check-small-rounded';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import getAnimeFromMAL from '@/services/api/integrations/mal/getAnimeFromMAL';
import importAnilistWatch from '@/services/api/settings/importAnilistWatch';
import { State } from '@/services/providers/collection-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

interface Props {
    setCollectionState: Dispatch<SetStateAction<State>>;
}

const formSchema = z.object({
    username: z.string(),
});

const AnilistCollection: FC<Props> = ({ setCollectionState }) => {
    const { closeModal } = useModalContext();
    const [selectedList, setSelectedList] = useState<string | undefined>(
        undefined,
    );
    const [watchList, setWatchList] = useState<Record<string, any>[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const [aniListLoading, setAniListLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutation = useMutation({
        mutationFn: importAnilistWatch,
        onSuccess: (data) => {
            data.length > 0 && setWatchList(data);
        },
    });

    const getListNames = () => {
        return watchList.reduce((acc: string[], val) => {
            if (acc.includes(val.my_status)) return acc;

            acc.push(val.my_status);
            return acc;
        }, []);
    };

    const getWatchlist = async () => {
        setAniListLoading(true);
        try {
            const res = await getAnimeFromMAL({
                params: {
                    mal_ids: watchList
                        .filter((item) => item.my_status === selectedList)
                        .map((item) => item.series_animedb_id),
                },
            });

            setCollectionState!((prev) => ({
                ...prev,
                title: selectedList!,
                groups: [
                    {
                        id: selectedList!,
                        title: null,
                        isGroup: false,
                        items: res.map((anime) => ({
                            id: anime.slug,
                            content: anime,
                        })),
                    },
                ],
            }));

            closeModal();
        } catch (e) {
            enqueueSnackbar('Не вдалось завантажити список аніме зі списку', {
                variant: 'error',
            });
        }
        setAniListLoading(false);
    };

    const lists = getListNames().map((list: string) => ({
        value: list,
        label: list,
    }));

    return (
        <div className="flex w-full flex-col gap-6">
            <Form {...form}>
                <form
                    className="flex items-end gap-2"
                    onSubmit={form.handleSubmit((data) =>
                        mutation.mutate({ ...data, isCustomList: true }),
                    )}
                >
                    <FormInput
                        label="Ім’я користувача AniList"
                        type="text"
                        name="username"
                        className="flex-1"
                        placeholder="Введіть імʼя користувача"
                    />
                    <Button
                        size="icon"
                        type="submit"
                        variant="secondary"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <MaterialSymbolsCheckSmallRounded className="text-2xl" />
                        )}
                    </Button>
                </form>
            </Form>

            <div className="flex w-full flex-col gap-2">
                <Label>Список</Label>
                <div className="flex gap-2">
                    <Select
                        disabled={lists.length === 0 || aniListLoading}
                        value={selectedList ? [selectedList] : undefined}
                        onValueChange={(value) => setSelectedList(value[0])}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Виберіть список..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {lists.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button
                disabled={!selectedList || aniListLoading}
                onClick={getWatchlist}
            >
                Імпортувати
            </Button>
        </div>
    );
};

export default AnilistCollection;
