'use client';

import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, useState } from 'react';
import MaterialSymbolsCheckSmallRounded from '~icons/material-symbols/check-small-rounded';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import getAnimeFromMAL from '@/services/api/integrations/mal/getAnimeFromMAL';
import importAnilistWatch from '@/services/api/settings/importAnilistWatch';
import { State } from '@/services/providers/collection-provider';
import { useModalContext } from '@/services/providers/modal-provider';

interface Props {
    setCollectionState: Dispatch<SetStateAction<State>>;
}

const AnilistCollection = ({ setCollectionState }: Props) => {
    const { closeModal } = useModalContext();
    const [selectedList, setSelectedList] = useState<string | undefined>(
        undefined,
    );
    const [watchList, setWatchList] = useState<Record<string, any>[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const [aniListLoading, setAniListLoading] = useState(false);
    const [aniListUsername, setAniListUsername] = useState('');

    const getFromAniList = async () => {
        setAniListLoading(true);
        try {
            const res = await importAnilistWatch({
                username: aniListUsername,
                isCustomList: true,
            });
            res.length > 0 && setWatchList(res);
        } catch (e) {
            enqueueSnackbar(
                'Не вдалось завантажити список даного користувача',
                { variant: 'error' },
            );
        }
        setAniListLoading(false);
    };

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
                mal_ids: watchList
                    .filter((item) => item.my_status === selectedList)
                    .map((item) => item.series_animedb_id),
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
            <div className="flex w-full flex-col gap-2">
                <Label>Ім’я користувача AniList</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        className="flex-1"
                        placeholder="Введіть імʼя користувача"
                        onChange={(e) => setAniListUsername(e.target.value)}
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={getFromAniList}
                        disabled={
                            aniListUsername.length === 0 || aniListLoading
                        }
                    >
                        {aniListLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <MaterialSymbolsCheckSmallRounded className="text-2xl" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Список</Label>
                <div className="flex gap-2">
                    <Combobox
                        value={selectedList}
                        selectPlaceholder="Виберіть список..."
                        toggleProps={{
                            disabled: lists.length === 0 || aniListLoading,
                        }}
                        onChange={(value) => setSelectedList(value)}
                        options={lists}
                        className="w-full"
                    />
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
