'use client';

import { ListFilter } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import FilterPresetModal from './filter-preset-modal';

interface Props {
    className?: string;
}

const FilterPresetButton: FC<Props> = ({ className }) => {
    const { openModal } = useModalContext();

    const openPresetsModal = () => {
        openModal({
            content: <FilterPresetModal />,
            className: '!max-w-xl',
            title: 'Пресети',
            forceModal: true,
        });
    };

    return (
        <Button
            className={cn(className)}
            size="sm"
            variant="outline"
            onClick={openPresetsModal}
        >
            <ListFilter className="size-2" />
            Пресети
        </Button>
    );
};

export default FilterPresetButton;
