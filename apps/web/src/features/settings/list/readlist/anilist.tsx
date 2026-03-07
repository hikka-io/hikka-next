'use client';

import { ContentTypeEnum, ImportReadArgs, ImportWatchArgs } from '@hikka/client';
import { AnilistTypeEnum, useAnilist } from '@hikka/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

import MaterialSymbolsCheckSmallRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckSmallRounded';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FoundList from '../../components/list/found-list';

interface Props {
    readList: ImportReadArgs[];
    setReadList: Dispatch<SetStateAction<ImportReadArgs[]>>;
    importing: boolean;
}

const Component = ({ readList, setReadList, importing }: Props) => {
    const [aniListUsername, setAniListUsername] = useState('');
    const { mutate: fetchAnilist, isPending: aniListLoading } = useAnilist({
        options: {
            onSuccess: (data) => {
                setReadList(data as ImportReadArgs[]);
            },
            onError: (error: Error) => {
                toast.error(error.message);
            },
        },
    });

    const getFromAniList = async () => {
        fetchAnilist({ username: aniListUsername, type: AnilistTypeEnum.MANGA });
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
            {readList.length > 0 && (
                <FoundList list={readList} type={ContentTypeEnum.MANGA} />
            )}
        </div>
    );
};

export default Component;
