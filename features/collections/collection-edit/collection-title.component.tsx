'use client';

import { useParams } from 'next/navigation';

import PlateEditor from '@/components/markdown/plate-editor/plate-editor';
import Header from '@/components/ui/header';

import { useCollectionContext } from '@/services/providers/collection-provider';

const CollectionTitle = () => {
    const { reference } = useParams();

    const {
        title,
        description,
        setState: setCollectionState,
    } = useCollectionContext();

    return (
        <div className="flex flex-col gap-4">
            <Header title={title || 'Нова колекція'} />
            {((reference && description) || !reference) && (
                <PlateEditor
                    onChange={(markdown) =>
                        setCollectionState!((state) => ({
                            ...state,
                            description: markdown,
                        }))
                    }
                    placeholder="Введіть опис"
                    value={description}
                    // ref={ref}
                />
            )}
        </div>
    );
};

export default CollectionTitle;
