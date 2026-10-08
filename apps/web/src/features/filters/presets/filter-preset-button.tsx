import { type FC, useState } from 'react';

import { ListFilter } from 'lucide-react';

import type { ContentTypeEnum } from '@hikka/api';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { cn } from '@/utils/cn';

import FilterPresetEditModal from './filter-preset-edit-modal';
import FilterPresetModal from './filter-preset-modal';
import type { FilterPreset } from './types';

type Props = {
    className?: string;
    contentType: ContentTypeEnum;
};

const FilterPresetButton: FC<Props> = ({ className, contentType }) => {
    const [presetsOpen, setPresetsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editPreset, setEditPreset] = useState<FilterPreset | undefined>(
        undefined,
    );

    // The editor stacks over the list, so dismissing it uncovers the list again.
    const openEditor = (preset?: FilterPreset) => {
        setEditPreset(preset);
        setEditOpen(true);
    };

    const handleCreatePreset = () => openEditor(undefined);

    const handleEditPreset = (preset: FilterPreset) => openEditor(preset);

    const handleCreateFromCurrent = (filters: Partial<FilterPreset>) =>
        openEditor(filters as FilterPreset);

    const handleEditBack = () => {
        setEditOpen(false);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setPresetsOpen(false);
    };

    return (
        <>
            <Button
                className={cn(className)}
                size="sm"
                variant="outline"
                onClick={() => setPresetsOpen(true)}
            >
                <ListFilter className="size-2" />
                Пресети
            </Button>
            <ResponsiveModal
                open={presetsOpen}
                onOpenChange={setPresetsOpen}
                mobile="page"
            >
                <ResponsiveModalContent className="md:max-w-xl" title="Пресети">
                    <FilterPresetModal
                        contentType={contentType}
                        onClose={() => setPresetsOpen(false)}
                        onCreatePreset={handleCreatePreset}
                        onEditPreset={handleEditPreset}
                        onCreateFromCurrent={handleCreateFromCurrent}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
            <ResponsiveModal
                open={editOpen}
                onOpenChange={setEditOpen}
                mobile="page"
            >
                <ResponsiveModalContent
                    className="md:max-w-xl"
                    title={
                        editPreset?.id ? 'Редагувати пресет' : 'Створити пресет'
                    }
                >
                    <FilterPresetEditModal
                        filterPreset={editPreset}
                        onClose={handleEditClose}
                        onBack={handleEditBack}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default FilterPresetButton;
