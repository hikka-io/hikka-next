'use client';

import { ListFilter } from 'lucide-react';
import { FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';

import { cn } from '@/utils/cn';

import FilterPresetEditModal from './filter-preset-edit-modal';
import FilterPresetModal from './filter-preset-edit-modal/filter-preset-modal';

interface Props {
    className?: string;
}

const FilterPresetButton: FC<Props> = ({ className }) => {
    const [presetsOpen, setPresetsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editPreset, setEditPreset] = useState<
        Hikka.FilterPreset | undefined
    >(undefined);

    const handleCreatePreset = () => {
        setEditPreset(undefined);
        setEditOpen(true);
    };

    const handleEditPreset = (preset: Hikka.FilterPreset) => {
        setEditPreset(preset);
        setEditOpen(true);
    };

    const handleCreateFromCurrent = (filters: Partial<Hikka.FilterPreset>) => {
        setEditPreset(filters as Hikka.FilterPreset);
        setEditOpen(true);
    };

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
                forceDesktop
            >
                <ResponsiveModalContent className="md:max-w-xl" title="Пресети">
                    <FilterPresetModal
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
                forceDesktop
            >
                <ResponsiveModalContent className="md:max-w-xl">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>
                            {editPreset?.id
                                ? 'Редагувати пресет'
                                : 'Створити пресет'}
                        </ResponsiveModalTitle>
                    </ResponsiveModalHeader>
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
