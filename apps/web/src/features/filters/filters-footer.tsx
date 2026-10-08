import { type FC, useState } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import AntDesignClearOutlined from '@/components/icons/ant-design/AntDesignClearOutlined';
import { CustomCopyAddRounded } from '@/components/icons/custom/CustomCopyAddRounded';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { useRouteSearch } from '@/utils/navigation';

import { presetFromSearch } from './preset-search-mapper';
import FilterPresetEditModal from './presets/filter-preset-edit-modal';
import type { FilterPreset } from './presets/types';
import { useClearFilters } from './use-clear-filters';

export type FiltersFooterProps = {
    className?: string;
    /** Enables the catalog-only save-as-preset action; watch/read lists omit it. */
    contentType?: ContentTypeEnum;
    /** Dismisses the surrounding modal; the always-visible sidebar omits it. */
    onDone?: () => void;
};

/** Clear filters + (catalog-only) save-as-preset actions for the filter panels. */
const FiltersFooter: FC<FiltersFooterProps> = ({
    className,
    contentType,
    onDone,
}) => {
    const [open, setOpen] = useState(false);
    const [currentFilters, setCurrentFilters] =
        useState<Partial<FilterPreset> | null>(null);
    const search = useRouteSearch();

    const clearFilters = useClearFilters({
        preserve: ['search', 'sort', 'order'],
    });

    const handleCreateFromCurrent = () => {
        setCurrentFilters(presetFromSearch(search, contentType));
        setOpen(true);
    };

    return (
        <>
            <div className={cn('flex flex-col gap-3', className)}>
                <div className="flex gap-3">
                    <Button
                        size="md"
                        className="flex-1"
                        variant="outline"
                        onClick={clearFilters}
                    >
                        <AntDesignClearOutlined /> Очистити
                    </Button>
                    {contentType && (
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        size="icon-md"
                                        variant="secondary"
                                        onClick={handleCreateFromCurrent}
                                    />
                                }
                            >
                                <CustomCopyAddRounded />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Створити пресет з поточних фільтрів</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                {onDone && (
                    <Button size="md" onClick={onDone}>
                        Готово
                    </Button>
                )}
            </div>
            {contentType && (
                <ResponsiveModal
                    open={open}
                    onOpenChange={setOpen}
                    mobile="page"
                >
                    <ResponsiveModalContent
                        className="md:max-w-xl"
                        title="Створити пресет з поточних"
                    >
                        {currentFilters && (
                            <FilterPresetEditModal
                                filterPreset={currentFilters as FilterPreset}
                                onClose={() => setOpen(false)}
                            />
                        )}
                    </ResponsiveModalContent>
                </ResponsiveModal>
            )}
        </>
    );
};

export default FiltersFooter;
