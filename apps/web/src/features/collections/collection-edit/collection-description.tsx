import type { FC } from 'react';

import { PlateMarkdownEditor } from '@/components/plate/editor/markdown-editor';

import { useCollectionContext } from './collection-provider';

const CollectionDescription: FC = () => {
    const description = useCollectionContext((state) => state.description);
    const setDescription = useCollectionContext(
        (state) => state.setDescription,
    );

    return (
        <PlateMarkdownEditor
            value={description}
            onValueChange={setDescription}
            placeholder="Опишіть, про що ця колекція"
            modalTitle="Опис колекції"
            modalButtonTitle="Написати опис"
            modalEditButtonTitle="Редагувати опис"
            preventUnsavedClose={false}
        />
    );
};

export default CollectionDescription;
