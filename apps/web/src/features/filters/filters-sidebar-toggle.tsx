import type { FC } from 'react';

import { PanelRightClose, PanelRightOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useFiltersSidebar } from './use-filters-sidebar';

type Props = {
    storageKey?: string;
};

const FiltersSidebarToggle: FC<Props> = ({ storageKey }) => {
    const { visible: sidebarVisible, toggle: toggleSidebar } =
        useFiltersSidebar(storageKey);

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        variant={sidebarVisible ? 'default' : 'outline'}
                        size="icon-md"
                        onClick={toggleSidebar}
                        className="hidden shrink-0 lg:inline-flex"
                        aria-label={
                            sidebarVisible
                                ? 'Приховати фільтри'
                                : 'Показати фільтри'
                        }
                    />
                }
            >
                {sidebarVisible ? (
                    <PanelRightClose className="size-4" />
                ) : (
                    <PanelRightOpen className="size-4" />
                )}
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    {sidebarVisible
                        ? 'Приховати панель фільтрів'
                        : 'Показати панель фільтрів'}
                </p>
            </TooltipContent>
        </Tooltip>
    );
};

export default FiltersSidebarToggle;
