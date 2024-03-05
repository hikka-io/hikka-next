'use client';

import React from 'react';
import MaterialSymbolsNotificationImportantRounded from '~icons/material-symbols/notification-important-rounded';

import { Label } from '@/components/ui/label';

interface Props {}

const Component = ({}: Props) => {
    return (
        <div className="flex gap-4 items-start py-3 px-2">
            <div className="border-secondary/60 bg-secondary/30 p-2 rounded-md">
                <MaterialSymbolsNotificationImportantRounded />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Сповіщень не знайдено</Label>
                <p className="text-sm text-muted-foreground">
                    Тут будуть відображатись майбутні сповіщення
                </p>
            </div>
        </div>
    );
};

export default Component;