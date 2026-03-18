'use client';

import { ContentTypeEnum, ImportReadArgs } from '@hikka/client';
import { useImportReadList } from '@hikka/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import General from '../components/import-list';
import Anilist from './anilist';

const Component = () => {
    const [tab, setTab] = useState<'general' | 'aniList'>('general');
    const [rewrite, setRewrite] = useState(true);
    const [readList, setReadList] = useState<ImportReadArgs[]>([]);
    const [importing, setImporting] = useState<boolean>(false);

    const mutationImportReadList = useImportReadList({
        options: {
            onSuccess: () => {
                toast.success(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">{readList.length}</span>{' '}
                        манґи та ранобе до Вашого списку.
                    </span>,
                );
            },
        },
    });

    const handleCompleteImport = async () => {
        setImporting(true);

        if (readList && readList.length > 0) {
            try {
                mutationImportReadList.mutate({
                    overwrite: rewrite,
                    content: readList,
                });
            } catch (e) {}
        }

        setImporting(false);
    };

    return (
        <div className="flex flex-col items-start gap-6">
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
                        list={readList}
                        content_type={ContentTypeEnum.MANGA}
                        setList={setReadList}
                    />
                </TabsContent>
                <TabsContent value="aniList">
                    <Anilist
                        readList={readList}
                        setReadList={setReadList}
                        importing={importing}
                    />
                </TabsContent>
            </Tabs>

            <div className="flex w-full items-center justify-between space-x-2">
                <Label htmlFor="rewrite">
                    Переписати манґу та ранобе, які вже додані до списку
                </Label>
                <Switch
                    checked={rewrite}
                    onCheckedChange={(checked) => setRewrite(checked)}
                    id="rewrite"
                />
            </div>

            <Button
                variant="default"
                size="md"
                onClick={handleCompleteImport}
                disabled={readList.length === 0}
                type="submit"
            >
                {importing && <span className="loading loading-spinner"></span>}
                Імпортувати
            </Button>
        </div>
    );
};

export default Component;
