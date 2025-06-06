'use client';

import { ImportWatchArgs } from '@hikka/client';
import { useAnilist } from '@hikka/react';
import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, useState } from 'react';

import MaterialSymbolsCheckSmallRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckSmallRounded';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FoundList from './found-list';

interface Props {
    watchList: ImportWatchArgs[];
    setWatchList: Dispatch<SetStateAction<ImportWatchArgs[]>>;
    importing: boolean;
}

const Component = ({ watchList, setWatchList, importing }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const [aniListUsername, setAniListUsername] = useState('');
    const { mutate: fetchAnilist, isPending: aniListLoading } = useAnilist({
        options: {
            onSuccess: (data) => {
                setWatchList(data);
            },
            onError: (error) => {
                enqueueSnackbar(error.message, { variant: 'error' });
            },
        },
    });

    const getFromAniList = async () => {
        fetchAnilist({ username: aniListUsername });
    };

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
                            aniListUsername.length === 0 ||
                            aniListLoading ||
                            importing
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
            {watchList.length > 0 && <FoundList watchList={watchList} />}
        </div>
    );
};

export default Component;
