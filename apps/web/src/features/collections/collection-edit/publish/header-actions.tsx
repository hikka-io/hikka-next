import type { FC } from 'react';

import MaterialSymbolsSettingsOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsSettingsOutlineRounded';
import { Button } from '@/components/ui/button';

import type { CollectionSave } from '../use-collection-save';
import SaveButton from './save-button';

type Props = Pick<CollectionSave, 'save'> & {
    onOpenSettings: () => void;
};

const HeaderActions: FC<Props> = ({ save, onOpenSettings }) => (
    <div className="flex items-center gap-1">
        <Button
            variant="ghost"
            size="icon-md"
            aria-label="Налаштування публікації"
            onClick={onOpenSettings}
        >
            <MaterialSymbolsSettingsOutlineRounded />
        </Button>
        <SaveButton size="sm" save={save} />
    </div>
);

export default HeaderActions;
