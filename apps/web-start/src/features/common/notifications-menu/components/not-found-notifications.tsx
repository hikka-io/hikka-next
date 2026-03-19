'use client';

import { FC } from 'react';

import MaterialSymbolsNotificationImportantRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationImportantRounded';
import { Label } from '@/components/ui/label';

interface Props {}

const NotFoundNotifications: FC<Props> = () => {
    return (
        <div className="flex items-start gap-4 px-2 py-3">
            <div className="border-border bg-secondary/20 rounded-md p-2">
                <MaterialSymbolsNotificationImportantRounded />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Сповіщень не знайдено</Label>
                <p className="text-muted-foreground text-sm">
                    Тут будуть відображатись майбутні сповіщення
                </p>
            </div>
        </div>
    );
};

export default NotFoundNotifications;
