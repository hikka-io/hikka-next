'use client';

import { ContentTypeEnum, ImportWatchArgs } from '@hikka/client';
import { useImportWatchList } from '@hikka/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useModalContext } from '@/services/providers/modal-provider';

import General from '../../components/list/import-list';
import Anilist from './anilist';

const Component = () => {
    const [tab, setTab] = useState<'general' | 'aniList'>('general');
    const { closeModal } = useModalContext();
    const [rewrite, setRewrite] = useState(true);
    const [watchList, setWatchList] = useState<ImportWatchArgs[]>([]);
    const [importing, setImporting] = useState<boolean>(false);

    const mutationImportWatchList = useImportWatchList({
        options: {
            onSuccess: () => {
                toast.success(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">{watchList.length}</span>{' '}
                        аніме до Вашого списку.
                    </span>,
                );

                closeModal();
            },
        },
    });

    const handleCompleteImport = async () => {
        setImporting(true);

        if (watchList && watchList.length > 0) {
            mutationImportWatchList.mutate({
                overwrite: rewrite,
                anime: watchList,
            });
        }

        setImporting(false);
    };

    useEffect(() => {
        setWatchList([]);
    }, [tab]);

    return (
        <div className="flex w-full flex-col items-start gap-6">
            <Tabs
                className="flex w-full flex-col gap-4"
                value={tab}
                onValueChange={(v) => setTab(v as 'general' | 'aniList')}
            >
                <TabsList className="w-fit gap-2">
                    <TabsTrigger value="general">Загальний</TabsTrigger>
                    <TabsTrigger value="aniList">AniList</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <General
                        list={watchList}
                        content_type={ContentTypeEnum.ANIME}
                        setList={setWatchList}
                    />
                </TabsContent>
                <TabsContent value="aniList">
                    <Anilist
                        watchList={watchList}
                        setWatchList={setWatchList}
                        importing={importing}
                    />
                </TabsContent>
            </Tabs>

            <div className="flex w-full items-center justify-between space-x-2">
                <Label htmlFor="rewrite">
                    Переписати аніме, які вже додані до списку
                </Label>
                <Switch
                    checked={rewrite}
                    onCheckedChange={(checked) => setRewrite(checked)}
                    id="rewrite"
                />
            </div>

            <Button
                variant="default"
                onClick={handleCompleteImport}
                disabled={watchList.length === 0}
                type="submit"
                size="md"
            >
                {importing && <span className="loading loading-spinner"></span>}
                Імпортувати
            </Button>
        </div>
    );
};

export default Component;
