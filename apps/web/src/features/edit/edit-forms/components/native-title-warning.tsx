import type { FC } from 'react';

import { MaterialSymbolsWarningOutlineRounded } from '@/components/icons/material-symbols/MaterialSymbolsWarningOutlineRounded';

const NativeTitleWarning: FC = () => {
    return (
        <div className="flex items-start gap-4 rounded-md border border-warning-border bg-warning p-4 text-warning-foreground">
            <MaterialSymbolsWarningOutlineRounded className="mt-0.5 shrink-0 text-xl" />
            <div className="flex flex-1 flex-col gap-2 text-sm">
                <p>
                    У цього контенту немає оригінальної назви. Коли ви
                    надсилаєте неповні дані, редактори змушені самостійно шукати
                    й перевіряти інформацію, через що розгляд усіх наступних
                    правок сповільнюється.
                </p>
                <p className="text-warning-foreground/70">
                    * і не забувайте про опис правки: посилання на ресурс,
                    звідки ви взяли оригінальне імʼя, цілком вистачить.
                </p>
            </div>
        </div>
    );
};

export default NativeTitleWarning;
