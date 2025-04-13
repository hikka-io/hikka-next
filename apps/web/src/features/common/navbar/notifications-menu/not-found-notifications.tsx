'use client';

import { FC } from 'react';

import MaterialSymbolsNotificationImportantRounded from '../../../../components/icons/material-symbols/MaterialSymbolsNotificationImportantRounded';
import P from '../../../../components/typography/p';
import { Label } from '../../../../components/ui/label';

interface Props {}

const NotFoundNotifications: FC<Props> = () => {
    return (
        <div className="flex items-start gap-4 px-2 py-3">
            <div className="rounded-md border-border bg-secondary/20 p-2">
                <MaterialSymbolsNotificationImportantRounded />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Сповіщень не знайдено</Label>
                <P className="text-sm text-muted-foreground">
                    Тут будуть відображатись майбутні сповіщення
                </P>
            </div>
        </div>
    );
};

export default NotFoundNotifications;
