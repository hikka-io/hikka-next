import type { ComponentType, FC } from 'react';

import MaterialSymbolsEventList from '@/components/icons/material-symbols/MaterialSymbolsEventList';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useCatalogView } from './use-catalog-view';

const VIEW_OPTIONS = {
    grid: { label: 'Сітка', icon: MaterialSymbolsGridViewRounded },
    list: { label: 'Список', icon: MaterialSymbolsEventList },
    table: { label: 'Таблиця', icon: MaterialSymbolsEventList },
} satisfies Record<Hikka.View, { label: string; icon: ComponentType }>;

type Props = {
    viewKey: string;
    views: Hikka.View[];
};

const ViewToggle: FC<Props> = ({ viewKey, views }) => {
    const { view, setView } = useCatalogView(viewKey);

    const handleChangeView = ([value]: string[]) => {
        if (!value) return;
        setView(value as Hikka.View);
    };

    return (
        <ToggleGroup value={[view]} onValueChange={handleChangeView}>
            {views.map((value) => {
                const { label, icon: Icon } = VIEW_OPTIONS[value];

                return (
                    <Tooltip key={value}>
                        <TooltipTrigger
                            render={
                                <ToggleGroupItem
                                    value={value}
                                    aria-label={label}
                                />
                            }
                        >
                            <Icon />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{label}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            })}
        </ToggleGroup>
    );
};

export default ViewToggle;
