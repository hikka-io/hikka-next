'use client';

import { ImportReadArgs } from '@hikka/client';
import { useImportReadList } from '@hikka/react';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useModalContext } from '@/services/providers/modal-provider';

import General from './general';

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const [rewrite, setRewrite] = useState(true);
    const [readList, setReadList] = useState<ImportReadArgs[]>([]);
    const [importing, setImporting] = useState<boolean>(false);

    const mutationImportReadList = useImportReadList({
        options: {
            onSuccess: () => {
                enqueueSnackbar(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">{readList.length}</span>{' '}
                        манґи та ранобе до Вашого списку.
                    </span>,
                    { variant: 'success' },
                );

                closeModal();
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
