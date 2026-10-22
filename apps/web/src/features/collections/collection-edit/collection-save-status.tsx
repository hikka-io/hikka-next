import type { FC } from 'react';

import SaveIndicator from '@/components/save-indicator';

import { useCollectionContext } from './collection-provider';
import { describeSave } from './use-collection-save';

const CollectionSaveStatus: FC = () => {
    const save = useCollectionContext((state) => state.save);
    const reference = useCollectionContext((state) => state.reference);
    const { tone, label } = describeSave({ save, reference });

    return <SaveIndicator tone={tone} label={label} error={save.error} />;
};

export default CollectionSaveStatus;
