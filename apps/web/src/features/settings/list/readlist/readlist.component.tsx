'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import importRead from '@/services/api/settings/importRead';
import { useModalContext } from '@/services/providers/modal-provider';
import General from './general';

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const [rewrite, setRewrite] = useState(true);
    const [readList, setReadList] = useState<Record<string, any>[]>([]);
    const [importing, setImporting] = useState<boolean>(false);

    const handleCompleteImport = async () => {
        setImporting(true);

        if (readList && readList.length > 0) {
            try {
                await importRead({
                    params: {
                        overwrite: rewrite,
                        content: readList,
                    },
                });

                enqueueSnackbar(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">{readList.length}</span>{' '}
                        манґи та ранобе до Вашого списку.
                    </span>,
                    { variant: 'success' },
                );

                await queryClient.invalidateQueries();
                closeModal();
            } catch (e) {}
        }

        setImporting(false);
    };

    return (
        <div className="flex flex-col items-start gap-6">
            <General readList={readList} setReadList={setReadList} />

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
