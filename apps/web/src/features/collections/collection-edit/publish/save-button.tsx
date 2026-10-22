import type { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRefreshRounded from '@/components/icons/material-symbols/MaterialSymbolsRefreshRounded';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useCollectionContext } from '../collection-provider';
import {
    type CollectionSave,
    selectSaveDisabled,
} from '../use-collection-save';

type Props = Pick<CollectionSave, 'save'> & {
    size?: 'sm' | 'md';
    className?: string;
};

const SaveButton: FC<Props> = ({ save, size = 'md', className }) => {
    const created = useCollectionContext(
        (state) => state.reference !== undefined,
    );
    const disabled = useCollectionContext(selectSaveDisabled);

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        size={size}
                        className={className}
                        disabled={disabled}
                        onClick={save}
                    />
                }
            >
                {created ? (
                    <MaterialSymbolsRefreshRounded />
                ) : (
                    <MaterialSymbolsAddRounded />
                )}
                {created ? 'Оновити' : 'Створити'}
            </TooltipTrigger>
            <TooltipContent>
                {created ? 'Оновити колекцію' : 'Створити колекцію'} (⌘+S)
            </TooltipContent>
        </Tooltip>
    );
};

export default SaveButton;
